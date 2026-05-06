import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router"
import { AuthService } from "@/features/auth/auth.service"

const schema = z.object({
  email: z.email("Email non valida"),
})

type FormData = z.infer<typeof schema>

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await AuthService.sendPasswordRecovery(data.email)
      setSent(true)
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
          <CardTitle className="text-2xl">Password Dimenticata</CardTitle>
          <CardDescription className="text-base">
            {sent
              ? "Controlla la tua email per il link di ripristino."
              : "Inserisci la tua email per ricevere il link di recupero."}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-600">
              Ti abbiamo inviato un link di recupero. Il link scade in 10 minuti.
            </p>
            <Link to="/login" className="text-pink-500 hover:underline text-sm font-semibold">
              Torna al login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="La tua email" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Invio in corso..." : "Invia link di recupero"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="text-gray-700 hover:underline">
                Torna al login
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </div>
  )
}

export default ForgotPasswordPage
