---
description: How to deploy the backend on OCI Ampere A1 (free, no sleep)
---

# Deploy Backend on OCI Ampere A1

## Part 1: Create the VCN

1. Sign into [cloud.oracle.com](https://cloud.oracle.com)
2. Click the **hamburger menu** (≡) top-left → hover **"Networking"** → click **"Virtual Cloud Networks"**
3. Make sure your **region** (top-right dropdown) matches where you'll create the VM
4. Click **"Start VCN Wizard"** (blue button)
5. Select **"Create VCN with Internet Connectivity"** → click **"Start VCN Wizard"**
6. Fill in:
   - **VCN name**: `vyzora-vcn`
   - **Compartment**: leave as root (lancerhawk)
   - **VCN IPv4 CIDR block**: leave default `10.0.0.0/16`
   - **Public subnet IPv4 CIDR block**: leave default `10.0.0.0/24`
   - **Private subnet IPv4 CIDR block**: leave default `10.0.1.0/24`
   - **Use DNS hostnames**: leave checked
7. Click **"Next"** → review the summary → click **"Create"**
8. Wait ~10 seconds → click **"View VCN"**

You'll see your VCN with a public subnet, private subnet, internet gateway, and route tables all auto-created.

### Now open the firewall ports:

9. On the VCN detail page, click **"Security Lists"** in the left sidebar
10. Click **"Default Security List for vyzora-vcn"**
11. Click **"Add Ingress Rules"** and add these **one at a time**:

| Source CIDR | Protocol | Port | Purpose |
|---|---|---|---|
| `0.0.0.0/0` | TCP | `22` | SSH |
| `0.0.0.0/0` | TCP | `80` | HTTP (needed for SSL cert) |
| `0.0.0.0/0` | TCP | `443` | HTTPS |
| `0.0.0.0/0` | TCP | `3001` | Backend (direct access) |

For each rule: paste CIDR, select TCP, enter port, click **"Add Ingress Rules"**.

Done — your VCN is ready. Now go create the VM and select `vyzora-vcn` in the Networking section.

---

## Part 2: Create the VM

1. **Compute → Instances → "Create Instance"**
2. **Name**: `vyzora-backend`
3. **Image**: Oracle Linux 9 (default)
4. **Shape**: Change shape → **Ampere** → `VM.Standard.A1.Flex` → 2 OCPU, 8 GB RAM
5. **Networking**: Select `vyzora-vcn` and its public subnet
6. **Public IPv4**: Yes
7. **SSH Keys**: Generate a key pair → **save the private key** (`.key` file)
8. Click **Create** — wait ~2 min for status: Running
9. Note your **Public IP address** from the instance detail page

---

## Part 4: SSH Into the VM

```bash
chmod 400 /path/to/your-key.key
ssh -i /path/to/your-key.key opc@YOUR_PUBLIC_IP
```

> Note: Oracle Linux uses `opc` as the default user, not `ubuntu`.

---

## Part 5: Install Node.js & Git

// turbo
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs git
node --version
npm --version
```

---

## Part 6: Clone & Configure Backend

// turbo
```bash
git clone https://github.com/YOUR_USERNAME/vyzora.git
cd vyzora/backend
npm install
nano .env
```
Paste your environment variables. `Ctrl+O` to save, `Ctrl+X` to exit.

---

## Part 7: Run with PM2

// turbo
```bash
sudo npm install -g pm2
pm2 start npm --name "vyzora-backend" -- run start
pm2 save
pm2 startup
# Copy-paste the command PM2 outputs and run it
```

---

## Part 8: Install Nginx (HTTPS Reverse Proxy)

// turbo
```bash
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## Part 9: Get HTTPS via nip.io + Let's Encrypt

Your domain will be: `YOUR_PUBLIC_IP.nip.io`  
Example: if IP is `1.2.3.4` → domain is `1.2.3.4.nip.io` (resolves automatically, no DNS setup needed)

```bash
# Install certbot
sudo dnf install -y epel-release
sudo dnf install -y certbot python3-certbot-nginx

# Issue certificate (replace with your actual IP)
sudo certbot --nginx -d YOUR_PUBLIC_IP.nip.io

# Follow prompts: enter email, agree to TOS, choose redirect HTTP → HTTPS
```

Certbot will auto-configure Nginx for HTTPS. Certificates auto-renew every 90 days.

---

## Part 10: Configure Nginx to Proxy to Backend

```bash
sudo nano /etc/nginx/conf.d/vyzora.conf
```

Paste:

```nginx
server {
    listen 443 ssl;
    server_name YOUR_PUBLIC_IP.nip.io;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save (`Ctrl+O`, `Ctrl+X`), then:
```bash
sudo nginx -t           # test config
sudo systemctl reload nginx
```

---

## Part 11: Open Oracle's Internal Firewall (iptables)

OCI also has a host-level firewall. Open ports there too:

// turbo
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

---

## ✅ Done

Your backend is now live at:
```
https://YOUR_PUBLIC_IP.nip.io
```

- Runs 24/7, no sleep
- Free forever (OCI Always Free A1)
- HTTPS with auto-renewing certificate
- PM2 auto-restarts on crash or reboot
