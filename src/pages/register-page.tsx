import { useState } from "react"
import RegisterForm from "@/components/shadcn-studio/blocks/register-01/register-form"
import EmailOtp from "@/components/ui/email-otp"
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router"

const RegisterPage = () => {
    const [emailVerify, setEmailVerify] = useState<string | null>(null)

    return (
        <>
            <CardHeader className="gap-6">
                <div>
                    <CardTitle className="mb-1.5 text-2xl">
                        {emailVerify ? "Verifica la tua email" : "Registrati a Travel Experience"}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {emailVerify
                            ? `Abbiamo inviato un codice a ${emailVerify}. Inseriscilo qui sotto.`
                            : "Salva e Condividi le tue esperienze di viaggio più Belle!"}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {emailVerify ? (
                        <EmailOtp emailVerify={emailVerify} />
                    ) : (
                        <>
                            <RegisterForm onRegistered={(email) => setEmailVerify(email)} />
                            <p className="text-center text-muted-foreground">
                                Sei già registrato?{" "}
                                <Link to="/login" className="px-1 py-1 border bg-gray-300 rounded-full borderd bg text-card-foreground hover:underline">
                                    Accedi ora
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </CardContent>
        </>
    )
}

export default RegisterPage
