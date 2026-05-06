import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { useNavigate, useSearchParams, Link } from "react-router"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthService } from "@/features/auth/auth.service"

const schema = z.object({
  password: z.string()
    .min(8, "Almeno 8 caratteri")
    .regex(/[a-z]/, "Almeno una lettera minuscola")
    .regex(/[A-Z]/, "Almeno una lettera maiuscola")
    .regex(/[0-9]/, "Almeno un numero")
    .regex(/[!$&=?]/, "Almeno un simbolo tra ! $ & = ?"),
  passwordConfirmation: z.string().min(1, "Conferma password obbligatoria"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Le password non coincidono",
  path: ["passwordConfirmation"],
})

type FormData = z.infer<typeof schema>

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const token = searchParams.get("token") ?? ""
  const email = searchParams.get("email") ?? ""

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (!token || !email) {
    return (
      <div className="space-y-1">
        <CardHeader>
          <CardTitle className="text-2xl">Link non valido</CardTitle>
          <CardDescription>Il link di recupero non è valido o è scaduto.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/forgot-password" className="text-pink-500 hover:underline text-sm font-semibold">
            Richiedi un nuovo link
          </Link>
        </CardContent>
      </div>
    )
  }

  const onSubmit = async (data: FormData) => {
    try {
      await AuthService.passwordRecovery({ email, token, password: data.password, passwordConfirmation: data.passwordConfirmation })
      toast.success("Password modificata con successo! Effettua il login.")
      navigate("/login")
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Errore del server, riprova!"
      )
    }
  }

  return (
    <div className="space-y-1">
      <CardHeader className="gap-6">
        <div>
          <CardTitle className="text-2xl">Reimposta Password</CardTitle>
          <CardDescription className="text-base">Scegli una nuova password per il tuo account.</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="password">Nuova Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••••••"
                className="pr-9"
                {...register("password")}
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="passwordConfirmation">Conferma Password</Label>
            <div className="relative">
              <Input
                id="passwordConfirmation"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••••••••••"
                className="pr-9"
                {...register("passwordConfirmation")}
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
            {errors.passwordConfirmation && (
              <p className="text-sm text-destructive">{errors.passwordConfirmation.message}</p>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvataggio..." : "Reimposta Password"}
          </Button>
        </form>
      </CardContent>
    </div>
  )
}

export default ResetPasswordPage
