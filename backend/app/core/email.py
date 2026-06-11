"""
Email sender.
- In production: uses SMTP (Gmail, SendGrid, Resend, etc.)
- In development (no SMTP configured): prints the reset link to the console.
"""
from __future__ import annotations
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings

log = logging.getLogger(__name__)


def send_password_reset_email(to_email: str, reset_url: str) -> None:
    subject = "Reset your Forgea password"
    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family:sans-serif;background:#f9fafb;padding:40px 0;">
      <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <h1 style="font-size:24px;color:#111827;margin:0 0 8px;">Reset your password</h1>
        <p style="color:#6b7280;margin:0 0 24px;">
          We received a request to reset the password for your Forgea account associated with <strong>{to_email}</strong>.
        </p>
        <a href="{reset_url}"
           style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;
                  padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">
          Reset password
        </a>
        <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;">
          This link expires in <strong>15 minutes</strong>. If you didn't request a password reset, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#d1d5db;font-size:12px;margin:0;">© 2026 Forgea. All rights reserved.</p>
      </div>
    </body>
    </html>
    """
    text = f"Reset your Forgea password:\n\n{reset_url}\n\nThis link expires in 15 minutes."

    if not settings.SMTP_HOST or not settings.SMTP_USER:
        # Dev mode — print to console
        log.warning("⚠  SMTP not configured. Password reset link (DEV ONLY):")
        log.warning("   %s", reset_url)
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"Forgea <{settings.SMTP_USER}>"
        msg["To"] = to_email
        msg.attach(MIMEText(text, "plain"))
        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.ehlo()
            if settings.SMTP_TLS:
                server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, to_email, msg.as_string())

        log.info("Password reset email sent to %s", to_email)
    except Exception as exc:
        log.error("Failed to send email to %s: %s", to_email, exc)
        raise
