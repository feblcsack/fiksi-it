import { z } from "zod"

export const MAX_PROOF_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_PROOF_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]

export const paymentSchema = z.object({
  name: z.string().min(2, "Please enter your full name.").max(100, "Name is too long."),
  email: z.string().email("Enter a valid email address."),
  phone: z
    .string()
    // Allow digits, spaces, plus, parentheses, dashes and dots; 7-20 length.
    .min(7, "Phone number is too short.")
    .max(20, "Phone number is too long.")
    .regex(/^[0-9()+\-.\s]+$/, "Use digits and basic phone symbols only."),
  accountNumber: z
    .string()
    .min(8, "Bank account number is too short.")
    .max(24, "Bank account number is too long.")
    .regex(/^[0-9\s-]+$/, "Use digits, spaces or dashes only."),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the transfer terms." }),
  }),
})

export type PaymentFormValues = z.infer<typeof paymentSchema>
