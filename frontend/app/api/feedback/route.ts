import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(req: Request) {
    try {
        const { name, email, type, message } = await req.json();

        // Basic validation
        if (!name || !type || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const msg = {
            to: process.env.RECIPIENT_EMAIL || '70001933arin@gmail.com',
            from: {
                email: process.env.FROM_EMAIL || 'asitjain1234@gmail.com',
                name: 'Vyzora Feedback Service'
            },
            replyTo: email || process.env.FROM_EMAIL || 'asitjain1234@gmail.com',
            subject: `[Vyzora Feedback] New ${type.toUpperCase()}: from ${name}`,
            text: `New Feedback from ${name}\nType: ${type.toUpperCase()}\nEmail: ${email || 'Not provided'}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
                        <!-- Header -->
                        <div style="background-color: #0c1018; padding: 30px 40px; text-align: center; border-bottom: 4px solid #4f46e5;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">VYZORA</h1>
                            <p style="color: #818cf8; margin: 8px 0 0 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em;">New Feedback Received</p>
                        </div>
                        
                        <!-- Body -->
                        <div style="padding: 40px;">
                            <div style="margin-bottom: 30px;">
                                <span style="display: inline-block; padding: 6px 14px; background-color: ${type === 'bug' ? '#fee2e2' : type === 'feature' ? '#e0e7ff' : '#ecfdf5'}; color: ${type === 'bug' ? '#b91c1c' : type === 'feature' ? '#4338ca' : '#047857'}; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                                    ${type.toUpperCase()}
                                </span>
                            </div>

                            <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #f1f5f9;">
                                <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap;">"${message}"</p>
                            </div>

                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                        <span style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em;">Sender Name</span>
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right;">
                                        <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${name}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                        <span style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em;">Email Address</span>
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right;">
                                        <span style="color: #4f46e5; font-size: 14px; font-weight: 600;">${email || 'Anonymous'}</span>
                                    </td>
                                </tr>
                            </table>

                            <div style="margin-top: 40px; text-align: center;">
                                <a href="mailto:${email || process.env.FROM_EMAIL}" style="display: inline-block; padding: 14px 32px; background-color: #4f46e5; color: #ffffff; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">Reply to Feedback</a>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #f1f5f9;">
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">This email was sent from the Vyzora feedback system.</p>
                        </div>
                    </div>
                </div>
            `,
        };

        await sgMail.send(msg);

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const error = err as Error & { response?: { body: unknown } };
        console.error('SendGrid error:', error);
        if (error.response) {
            console.error('SendGrid response error body:', error.response.body);
        }
        return NextResponse.json({
            error: 'Failed to send email',
            details: error.message,
            sendgridError: error.response?.body || null
        }, { status: 500 });
    }
}
