import PaymentForm from "@/components/payment-form"

export const metadata = {
  title: "Payment Confirmation",
  description: "Secure and straightforward payment confirmation form",
}

export default function PaymentPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight">Payment Confirmation</h1>
        <p className="text-pretty mt-2 text-sm text-muted-foreground">
          Please provide your details and upload proof of transfer. We’ll verify and notify you via email.
        </p>
      </header>
      <PaymentForm />
    </main>
  )
}
