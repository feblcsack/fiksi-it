"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { paymentSchema, type PaymentFormValues, MAX_PROOF_SIZE, ALLOWED_PROOF_TYPES } from "@/lib/validation/payment"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ClientValues = PaymentFormValues & {
  proof: File | null
}

const defaultValues: ClientValues = {
  name: "",
  email: "",
  phone: "",
  accountNumber: "",
  terms: false,
  proof: null,
}

// Format file size
const formatFileSize = (bytes: number): string => {
  return bytes < 1024 * 1024 
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// Validate proof file
const validateProof = (file: File | null): string | null => {
  if (!file) return "Please upload proof of transfer."
  if (file.size > MAX_PROOF_SIZE) return "File is too large. Max size is 5MB."
  if (!ALLOWED_PROOF_TYPES.includes(file.type)) {
    return "Unsupported file type. Upload a JPG, PNG, WEBP, or PDF."
  }
  return null
}

export default function PaymentForm() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = React.useState(false)
  const [proofInfo, setProofInfo] = React.useState<{ name: string; size: number; type: string } | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  const form = useForm<ClientValues>({
    resolver: zodResolver(paymentSchema as z.ZodType<any>),
    defaultValues,
    mode: "onBlur",
  })

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = form
  const selectedFile = watch("proof")

  // Handle file preview and info - optimized with useCallback
  React.useEffect(() => {
    if (!(selectedFile instanceof File)) {
      setProofInfo(null)
      setPreviewUrl(null)
      return
    }

    setProofInfo({ 
      name: selectedFile.name, 
      size: selectedFile.size, 
      type: selectedFile.type 
    })

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [selectedFile])

  // File change handler - memoized
  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setValue("proof", file, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
  }, [setValue])

  // Submit handler
  const onSubmit = React.useCallback(async (values: ClientValues) => {
    const proofError = validateProof(values.proof || null)
    if (proofError) {
      toast({ title: "Upload issue", description: proofError, variant: "destructive" })
      return
    }

    try {
      setSubmitting(true)

      // Prepare form data
      const cleanedAccount = (values.accountNumber || "").replace(/[^0-9]/g, "")
      const fd = new FormData()
      fd.append("name", values.name.trim())
      fd.append("email", values.email.trim())
      fd.append("phone", values.phone.trim())
      fd.append("accountNumber", cleanedAccount)
      fd.append("terms", String(values.terms))
      if (values.proof) fd.append("proof", values.proof)

      // Submit to API
      const res = await fetch("/api/payment/confirm", {
        method: "POST",
        body: fd,
      })

      const data = await res.json().catch(() => ({}))
      
      if (!res.ok) {
        throw new Error(data?.error || "Submission failed. Please try again.")
      }

      // Show success message
      toast({
        title: "Submitted successfully",
        description: "We've received your payment confirmation. You'll get an email update shortly.",
      })

      // Reset form
      reset(defaultValues)
      setProofInfo(null)
      setPreviewUrl(null)
      
    } catch (err: any) {
      toast({
        title: "Could not submit",
        description: err?.message || "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }, [toast, reset])

  // Error message renderer - memoized
  const ErrorMessage = React.useMemo(() => 
    ({ id, message }: { id: string; message?: string }) => 
      message ? (
        <p id={id} className="text-sm text-destructive">{message}</p>
      ) : null,
    []
  )

  return (
    <Card as="section" aria-labelledby="payment-form-title">
      <CardHeader>
        <CardTitle id="payment-form-title" className="text-xl">
          Payment details
        </CardTitle>
        <CardDescription>
          Enter your information as it appears on your bank profile. Fields marked as required must be completed.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-6"
          noValidate
          aria-describedby={Object.keys(errors).length ? "form-errors" : undefined}
          encType="multipart/form-data"
        >
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="e.g. Taylor Jordan"
              autoComplete="name"
              aria-invalid={!!errors.name || undefined}
              aria-describedby="name-hint name-error"
              {...register("name")}
            />
            <p id="name-hint" className="text-xs text-muted-foreground">
              Your full legal name as on your bank account.
            </p>
            <ErrorMessage id="name-error" message={errors.name?.message as string} />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email || undefined}
              aria-describedby="email-hint email-error"
              {...register("email")}
            />
            <p id="email-hint" className="text-xs text-muted-foreground">
              We'll use this to notify you when your transfer is verified.
            </p>
            <ErrorMessage id="email-error" message={errors.email?.message as string} />
          </div>

          {/* Phone */}
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="+1 555 123 4567"
              autoComplete="tel"
              aria-invalid={!!errors.phone || undefined}
              aria-describedby="phone-hint phone-error"
              {...register("phone")}
            />
            <p id="phone-hint" className="text-xs text-muted-foreground">
              Include country code. Use digits and basic symbols only.
            </p>
            <ErrorMessage id="phone-error" message={errors.phone?.message as string} />
          </div>

          {/* Bank account */}
          <div className="grid gap-2">
            <Label htmlFor="accountNumber">Bank account number</Label>
            <Input
              id="accountNumber"
              inputMode="numeric"
              placeholder="e.g. 1234-5678-9012"
              autoComplete="off"
              aria-invalid={!!errors.accountNumber || undefined}
              aria-describedby="account-hint account-error"
              {...register("accountNumber")}
            />
            <p id="account-hint" className="text-xs text-muted-foreground">
              Digits only, you may include spaces or dashes; we'll format securely.
            </p>
            <ErrorMessage id="account-error" message={errors.accountNumber?.message as string} />
          </div>

          {/* Terms */}
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">Transfer terms</legend>
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                className={cn(
                  "h-4 w-4 shrink-0 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                )}
                aria-invalid={!!errors.terms || undefined}
                aria-describedby="terms-hint terms-error"
                {...register("terms")}
              />
              <div className="grid gap-1">
                <Label htmlFor="terms" className="font-normal">
                  I have reviewed and agree to the{" "}
                  <a
                    href="#"
                    className="underline underline-offset-4 hover:no-underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    transfer terms
                  </a>
                  .
                </Label>
                <p id="terms-hint" className="text-xs text-muted-foreground">
                  You confirm the transfer is legitimate and authorize verification of the details you submit.
                </p>
                <ErrorMessage id="terms-error" message={errors.terms?.message as string} />
              </div>
            </div>
          </fieldset>

          {/* Proof upload */}
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">Proof of transfer</legend>
            <Input
              id="proof"
              type="file"
              accept={ALLOWED_PROOF_TYPES.join(",")}
              aria-describedby="proof-hint proof-error proof-meta"
              onChange={handleFileChange}
            />
            <p id="proof-hint" className="text-xs text-muted-foreground">
              Upload a clear image or PDF of your bank transfer receipt. Max size 5MB. Allowed: JPG, PNG, WEBP, PDF.
            </p>
            {proofInfo && (
              <p id="proof-meta" className="text-xs text-muted-foreground">
                Selected: {proofInfo.name} • {formatFileSize(proofInfo.size)} • {proofInfo.type || "unknown"}
              </p>
            )}
            {previewUrl && (
              <div className="mt-1">
                <img
                  src={previewUrl}
                  alt="Preview of uploaded proof"
                  className="h-24 w-auto rounded-md border border-border object-cover"
                />
              </div>
            )}
            <span id="proof-error" className="sr-only">
              File validation errors will be announced on submit.
            </span>
          </fieldset>

          {/* Form-level errors live region */}
          <div id="form-errors" aria-live="polite" className="sr-only">
            {Object.values(errors).length ? "Please review the errors in the form fields." : ""}
          </div>

          <CardFooter className="px-0">
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Submitting..." : "Confirm payment"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}