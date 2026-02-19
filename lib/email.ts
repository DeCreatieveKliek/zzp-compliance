import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  await resend.emails.send({
    from: 'De Creatieve Kliek <noreply@decreatievekliek.nl>',
    to,
    subject: 'Wachtwoord opnieuw instellen',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px; text-align: center;">
              <p style="color: white; font-size: 22px; font-weight: 900; margin: 0;">De Creatieve Kliek</p>
            </div>
            <div style="padding: 32px;">
              <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 8px;">Wachtwoord opnieuw instellen</h1>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">Hallo ${name},</p>
              <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                We hebben een verzoek ontvangen om het wachtwoord van uw account opnieuw in te stellen. Klik op de knop hieronder om een nieuw wachtwoord in te stellen.
              </p>
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; margin-bottom: 24px;">
                Wachtwoord opnieuw instellen
              </a>
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px;">
                Deze link is <strong>1 uur</strong> geldig. Daarna dient u opnieuw een reset aan te vragen.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Heeft u dit niet aangevraagd? Dan kunt u deze e-mail veilig negeren.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
