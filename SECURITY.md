# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.x.x   | ✅ Active development |

---

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

If you discover a security issue in Vyzora, please report it responsibly:

1. **Email**: Open a [GitHub Security Advisory](https://github.com/Lancerhawk/Vyzora/security/advisories/new) (private disclosure)
2. Include as much detail as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge your report within **72 hours** and provide a timeline for a fix.

---

## Security Best Practices for Self-Hosters

- Always set a strong, unique `JWT_SECRET` in production
- Never commit `.env` files to version control
- Rotate your GitHub OAuth client secrets regularly
- Use HTTPS for all endpoints — never serve the ingest API over plain HTTP
- Restrict database access to your backend service only
- Keep all dependencies up to date (`npm audit` regularly)

---

## Disclosure Policy

Once a vulnerability is fixed and released:
- We will publish a security advisory crediting the reporter (unless anonymity is requested)
- A CHANGELOG entry will be added under the relevant version
