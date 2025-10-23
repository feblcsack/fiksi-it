// src/app/api/send-welcome-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import emailjs from '@emailjs/browser';

export async function POST(request: NextRequest) {
  try {
    const { email, username, role } = await request.json();

    // Validasi input
    if (!email || !username || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Template parameters untuk EmailJS
    const templateParams = {
      to_email: email,
      to_name: username,
      user_role: role === 'musisi' ? 'Musician' : 'User',
      username: username,
    };

    // Kirim email pake EmailJS
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );

    if (response.status === 200) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Email sending failed');
    }
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}