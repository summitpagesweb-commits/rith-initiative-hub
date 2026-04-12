import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DEFAULT_CONTACT_EMAIL = "rithinitiative@gmail.com";
const DEFAULT_FROM_EMAIL = "The Rith Initiative <onboarding@resend.dev>";
const RESEND_API_URL = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Simple in-memory rate limiting: max 3 submissions per IP per 15 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

// Escape user-supplied strings before embedding in HTML
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// Validate email format
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendEmail(
  resendApiKey: string,
  body: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    reply_to?: string;
  },
): Promise<void> {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    return;
  }

  const errorText = await response.text();
  let resendError = errorText;

  try {
    const parsed = JSON.parse(errorText);
    resendError = parsed.message || parsed.error || errorText;
  } catch {
    // Keep raw response text as fallback
  }

  throw new Error(`Resend error (${response.status}): ${resendError}`);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  // Rate limiting by IP
  const clientIp =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (clientIp !== "unknown" && isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const contactEmail = Deno.env.get("CONTACT_EMAIL") || DEFAULT_CONTACT_EMAIL;
    const fromEmail = Deno.env.get("FROM_EMAIL") || DEFAULT_FROM_EMAIL;

    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY secret");
      return new Response(
        JSON.stringify({ error: "Email service is not configured correctly." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const {
      name: rawName,
      email: rawEmail,
      subject: rawSubject,
      message: rawMessage,
    }: ContactEmailRequest = await req.json();

    const name = rawName?.trim();
    const email = rawEmail?.trim();
    const subject = rawSubject?.trim();
    const message = rawMessage?.trim();

    console.log("Received contact form submission:", { name, email, subject });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Enforce field length limits to prevent abuse
    if (name.length > 200 || subject.length > 500 || message.length > 10000) {
      return new Response(
        JSON.stringify({ error: "Input exceeds maximum allowed length" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Escape all user inputs before embedding in HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    // Send notification email to the organization
    await sendEmail(resendApiKey, {
      from: fromEmail,
      to: [contactEmail],
      reply_to: email,
      subject: `Contact Form: ${subject}`,
      html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <h3>Message:</h3>
          <p>${safeMessage}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This message was sent from the contact form on The Rith Initiative website.</p>
        `,
    });

    console.log("Notification email sent successfully");

    // Send confirmation email to the user
    try {
      await sendEmail(resendApiKey, {
        from: fromEmail,
        to: [email],
        subject: "Thank you for contacting The Rith Initiative",
        html: `
          <h2>Thank you for reaching out, ${safeName}!</h2>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <h3>Your Message:</h3>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p>${safeMessage}</p>
          <hr>
          <p>Best regards,<br>The Rith Initiative Team</p>
          <p style="color: #666; font-size: 12px;">
            If you have any urgent questions, please email us at rithinitiative@gmail.com
          </p>
        `,
      });
      console.log("Confirmation email sent successfully");
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
      // Intentionally non-blocking. Admin notification already succeeded.
    }

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
