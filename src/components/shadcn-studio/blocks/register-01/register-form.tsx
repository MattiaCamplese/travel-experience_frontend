import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthService } from '@/features/auth/auth.service'

export const registerSchema = z.object({
  first_name: z.string().min(1, "Nome obbligatorio"),
  last_name: z.string().min(1, "Cognome obbligatorio"),
  email: z.email("Email non valida"),
  password: z.string().min(8, "Minimo 8 caratteri"),
  password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
  message: "Le password non coincidono",
  path: ["password_confirmation"],
})

type RegisterFormData = z.infer<typeof registerSchema>

type RegisterFormProps = {
  onRegistered: (email: string) => void
}

const RegisterForm = ({ onRegistered }: RegisterFormProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await AuthService.register(data)
      toast.success("Registrazione completata! Controlla la tua email.")
      onRegistered(data.email)
    } catch {
      toast.error("Errore durante la registrazione")
    }
  }

  return (
    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
      {/* Nome */}
      <div className='space-y-1'>
        <Label className='leading-5' htmlFor='first_name'>Nome*</Label>
        <Input type='text' id='first_name' placeholder='Il tuo nome' {...register("first_name")} />
        {errors.first_name && <p className='text-sm text-destructive'>{errors.first_name.message}</p>}
      </div>

      {/* Cognome */}
      <div className='space-y-1'>
        <Label className='leading-5' htmlFor='last_name'>Cognome*</Label>
        <Input type='text' id='last_name' placeholder='Il tuo cognome' {...register("last_name")} />
        {errors.last_name && <p className='text-sm text-destructive'>{errors.last_name.message}</p>}
      </div>

      {/* Email */}
      <div className='space-y-1'>
        <Label className='leading-5' htmlFor='userEmail'>Email*</Label>
        <Input type='email' id='userEmail' placeholder='La tua email' {...register("email")} />
        {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className='w-full space-y-1'>
        <Label className='leading-5' htmlFor='password'>Password*</Label>
        <div className='relative'>
          <Input id='password' type={isPasswordVisible ? 'text' : 'password'} placeholder='••••••••••••••••' className='pr-9' {...register("password")} />
          <Button variant='ghost' size='icon' type='button' onClick={() => setIsPasswordVisible(p => !p)}
            className='text-muted-foreground absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'>
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </div>
        {errors.password && <p className='text-sm text-destructive'>{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className='w-full space-y-1'>
        <Label className='leading-5' htmlFor='confirmPassword'>Conferma Password*</Label>
        <div className='relative'>
          <Input id='confirmPassword' type={isConfirmPasswordVisible ? 'text' : 'password'} placeholder='••••••••••••••••' className='pr-9' {...register("password_confirmation")} />
          <Button variant='ghost' size='icon' type='button' onClick={() => setIsConfirmPasswordVisible(p => !p)}
            className='text-muted-foreground absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'>
            {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </div>
        {errors.password_confirmation && <p className='text-sm text-destructive'>{errors.password_confirmation.message}</p>}
      </div>

      <Button className='w-full' type='submit' disabled={isSubmitting}>
        {isSubmitting ? "Registrazione in corso..." : "Registrati"}
      </Button>
    </form>
  )
}

export default RegisterForm
