import { Resend } from 'resend';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function validatePayload(body) {
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const projectType = (body.projectType || '').trim();
  const message = (body.message || '').trim();
  const consent = !!body.consent;

  if (!name) return { ok: false, message: 'Le nom est obligatoire.' };
  if (!email) return { ok: false, message: "L'email est obligatoire." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Adresse email invalide.' };
  }
  if (!message || message.length < 10) {
    return { ok: false, message: 'Le message doit contenir au moins 10 caracteres.' };
  }
  if (!consent) {
    return { ok: false, message: 'Le consentement est obligatoire.' };
  }

  return {
    ok: true,
    data: { name, email, phone, projectType, message, consent },
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'alexandre.chaligne@gmail.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured.' });
  }

  const parsed = validatePayload(req.body || {});
  if (!parsed.ok) {
    return res.status(400).json({ error: parsed.message });
  }

  const { name, email, phone, projectType, message } = parsed.data;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || 'Non renseigne');
  const safeProjectType = escapeHtml(projectType || 'Non renseigne');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `Nouvelle demande de devis - ${name}`,
      html: `
        <h2>Nouvelle demande de devis</h2>
        <p><strong>Nom :</strong> ${safeName}</p>
        <p><strong>Email :</strong> ${safeEmail}</p>
        <p><strong>Telephone :</strong> ${safePhone}</p>
        <p><strong>Type de projet :</strong> ${safeProjectType}</p>
        <p><strong>Message :</strong><br>${safeMessage}</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: "L'envoi de l'email a echoue.",
      details: error?.message || 'Unknown error',
    });
  }
}
