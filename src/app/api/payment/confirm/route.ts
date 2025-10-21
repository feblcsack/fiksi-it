// app/api/payment/confirm/route.ts
import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import nodemailer from "nodemailer"

// Konfigurasi email - ganti dengan detail Anda
const ADMIN_EMAIL = "admin@yourcompany.com" // Email Anda untuk menerima notifikasi
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true untuk 465, false untuk port lainnya
  auth: {
    user: process.env.SMTP_USER, // Email pengirim
    pass: process.env.SMTP_PASSWORD, // Password atau App Password
  },
}

// Validasi file
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]

// Helper: Format data untuk email
function formatPaymentData(data: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Payment Confirmation Received</h2>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #555;">Customer Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 40%;">Full Name:</td>
            <td style="padding: 8px 0;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
            <td style="padding: 8px 0;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Account Number:</td>
            <td style="padding: 8px 0;">${data.accountNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Terms Accepted:</td>
            <td style="padding: 8px 0;">${data.terms ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Submitted At:</td>
            <td style="padding: 8px 0;">${new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })}</td>
          </tr>
        </table>
      </div>
      <p style="color: #666; font-size: 14px;">
        The proof of transfer document is attached to this email.
      </p>
    </div>
  `
}

// Helper: Email konfirmasi untuk customer
function formatCustomerConfirmation(name: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Payment Confirmation Received</h2>
      <p>Dear ${name},</p>
      <p>Thank you for submitting your payment confirmation. We have received your details and proof of transfer.</p>
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
        <p style="margin: 0;"><strong>What's next?</strong></p>
        <p style="margin: 10px 0 0 0;">Our team will verify your payment within 1-2 business days. You'll receive an email once the verification is complete.</p>
      </div>
      <p style="color: #666; font-size: 14px;">
        If you have any questions, please don't hesitate to contact our support team.
      </p>
      <p style="color: #666; font-size: 14px;">
        Best regards,<br>
        Payment Team
      </p>
    </div>
  `
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    // Extract dan validasi data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const accountNumber = formData.get("accountNumber") as string
    const terms = formData.get("terms") === "true"
    const proofFile = formData.get("proof") as File

    // Validasi field required
    if (!name || !email || !phone || !accountNumber || !terms) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validasi file
    if (!proofFile) {
      return NextResponse.json(
        { error: "Proof of transfer is required" },
        { status: 400 }
      )
    }

    if (proofFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(proofFile.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed" },
        { status: 400 }
      )
    }

    // Simpan file ke server (opsional - untuk backup)
    const bytes = await proofFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadDir = join(process.cwd(), "uploads", "payment-proofs")
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const timestamp = Date.now()
    const sanitizedFilename = proofFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${sanitizedFilename}`
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Setup email transporter
    const transporter = nodemailer.createTransport(EMAIL_CONFIG)

    const paymentData = {
      name,
      email,
      phone,
      accountNumber,
      terms,
      filename: proofFile.name,
    }

    // Kirim email ke admin
    await transporter.sendMail({
      from: EMAIL_CONFIG.auth.user,
      to: ADMIN_EMAIL,
      subject: `New Payment Confirmation - ${name}`,
      html: formatPaymentData(paymentData),
      attachments: [
        {
          filename: proofFile.name,
          content: buffer,
          contentType: proofFile.type,
        },
      ],
    })

    // Kirim email konfirmasi ke customer
    await transporter.sendMail({
      from: EMAIL_CONFIG.auth.user,
      to: email,
      subject: "Payment Confirmation Received",
      html: formatCustomerConfirmation(name),
    })

    return NextResponse.json({
      success: true,
      message: "Payment confirmation submitted successfully",
      data: {
        name,
        email,
        submittedAt: new Date().toISOString(),
      },
    })

  } catch (error: any) {
    console.error("Payment confirmation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to process payment confirmation" },
      { status: 500 }
    )
  }
}