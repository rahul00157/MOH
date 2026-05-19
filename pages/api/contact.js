import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: "rahul@themohmedia.com",
    pass: process.env.SMTP_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, company, country, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const html = `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#d8d8d8;border:1px solid #2a2a2a;">

      <div style="padding:40px 48px 32px;border-bottom:1px solid #2a2a2a;">
        <p style="font-size:10px;letter-spacing:.5em;text-transform:uppercase;color:#b8a07a;margin:0 0 12px;">the MOH</p>
        <h1 style="font-size:26px;font-weight:700;color:#ffffff;margin:0;">New Inquiry</h1>
      </div>

      <div style="padding:40px 48px;display:flex;flex-direction:column;gap:0;">
        ${row("Name",    name)}
        ${row("Email",   email)}
        ${row("Phone",   phone    || "—")}
        ${row("Company", company  || "—")}
        ${row("Country", country  || "—")}
        ${row("Service", service  || "—")}
      </div>

      <div style="padding:0 48px 40px;">
        <p style="font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:#b8a07a;margin:0 0 10px;">Message</p>
        <p style="font-size:15px;color:#cccccc;line-height:1.7;margin:0;white-space:pre-wrap;">${escHtml(message)}</p>
      </div>

      <div style="padding:24px 48px;border-top:1px solid #2a2a2a;">
        <p style="font-size:10px;color:#555;letter-spacing:.2em;margin:0;">Sent via themohmedia.com contact form</p>
      </div>

    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"the MOH Website" <rahul@themohmedia.com>',
      to: "rahul@themohmedia.com",
      replyTo: email,
      subject: "New Inquiry - the MOH",
      html,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    console.error("SMTP Error:", err.message, err.code);
    return res.status(500).json({ error: "Failed to send message. Please try again." });
  }
}

function row(label, value) {
  return `
    <div style="padding:14px 0;border-bottom:1px solid #1e1e1e;">
      <span style="font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:#b8a07a;display:block;margin-bottom:4px;">${label}</span>
      <span style="font-size:15px;color:#ffffff;">${escHtml(String(value))}</span>
    </div>
  `;
}

function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
