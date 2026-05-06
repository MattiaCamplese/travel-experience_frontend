import { Button } from "@/components/ui/button"
import { AuthService } from "@/features/auth/auth.service"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { CheckIcon, Loader2, RefreshCcw } from "lucide-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { z } from "zod"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp"

export const verifyEmailSchema = z.object({
    code: z.string().min(6).max(6),
})

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>

type EmailOtpProps = {
    emailVerify: string
}

const EmailOtp = ({ emailVerify }: EmailOtpProps) => {
    const formRef = useRef<HTMLFormElement>(null)
    const navigate = useNavigate()

    const [otpValue, setOtpValue] = useState("")

    const otpForm = useForm<VerifyEmailFormData>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: { code: "" },
    })

    async function onOtpSubmit(values: VerifyEmailFormData) {
        try {
            const res = await AuthService.verifyEmail({
                email: emailVerify,
                code: values.code,
            })
            navigate(res.data.token ? "/" : "/login")
        } catch {
            toast.error("Codice non valido o scaduto. Riprova.")
            otpForm.reset()
            setOtpValue("")
        }
    }

    const resendEmailVerifyMutation = useMutation({
        mutationFn: () => AuthService.resendEmailVerify(emailVerify),
        onError: () => toast.error("Impossibile reinviare il codice"),
        onSuccess: () => toast.success("Nuovo codice inviato"),
    })

    return (
        <form ref={formRef} onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="mx-auto max-w-3xl space-y-4">
            <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => {
                    setOtpValue(value)
                    otpForm.setValue("code", value)
                    if (value.length === 6) {
                        formRef.current?.requestSubmit()
                    }
                }}
                pattern={REGEXP_ONLY_DIGITS}
            >
                <InputOTPGroup>
                    <InputOTPSlot className="size-16 text-2xl" index={0} />
                    <InputOTPSlot className="size-16 text-2xl" index={1} />
                    <InputOTPSlot className="size-16 text-2xl" index={2} />
                    <InputOTPSlot className="size-16 text-2xl" index={3} />
                    <InputOTPSlot className="size-16 text-2xl" index={4} />
                    <InputOTPSlot className="size-16 text-2xl" index={5} />
                </InputOTPGroup>
            </InputOTP>

            <div className="flex gap-4">
                <Button
                    type="button"
                    variant="outline"
                    disabled={resendEmailVerifyMutation.isPending}
                    onClick={() => resendEmailVerifyMutation.mutate()}
                >
                    <RefreshCcw className={cn(resendEmailVerifyMutation.isPending && "animate-spin")} />
                    Invia nuovo codice
                </Button>

                <Button type="submit" disabled={otpForm.formState.isSubmitting}>
                    {otpForm.formState.isSubmitting ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <CheckIcon />
                    )}
                    Verifica
                </Button>
            </div>
        </form>
    )
}

export default EmailOtp
