/**
 * White-Label Contact Form API Route
 * Handles inquiries for white-label solutions
 */

import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  users: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();
    const { name, email, company, users, message } = body;

    // Validate required fields
    if (!name || !email || !company) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, company' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Send an email to sales team
    // 2. Save to a CRM or database
    // 3. Send a confirmation email to the user
    // 4. Possibly create a Slack/Discord notification

    // For now, we'll log the inquiry and return success
    console.log('White-label inquiry received:', {
      name,
      email,
      company,
      users,
      message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // Example with SendGrid:
    // await sendEmail({
    //   to: 'sales@aipredictedsignals.com',
    //   from: 'noreply@aipredictedsignals.com',
    //   subject: `White-Label Inquiry from ${company}`,
    //   html: `
    //     <h2>New White-Label Inquiry</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Company:</strong> ${company}</p>
    //     <p><strong>Expected Users:</strong> ${users}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    // TODO: Send confirmation email to user
    // await sendEmail({
    //   to: email,
    //   from: 'sales@aipredictedsignals.com',
    //   subject: 'Thank you for your white-label inquiry',
    //   html: `
    //     <h2>Thank You for Your Inquiry</h2>
    //     <p>Hi ${name},</p>
    //     <p>We've received your inquiry about our white-label solutions and will get back to you within 24 hours.</p>
    //     <p>In the meantime, feel free to explore our documentation or schedule a demo call.</p>
    //     <p>Best regards,<br>AI Predicted Signals Team</p>
    //   `,
    // });

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been submitted successfully. We will contact you within 24 hours.',
    });
  } catch (err: any) {
    console.error('White-label contact form error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
