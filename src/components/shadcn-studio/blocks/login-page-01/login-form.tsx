import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthService } from '@/features/auth/auth.service'
import { AxiosError } from 'axios'

export const loginFormSchema = z.object({
  email: z.email("Email non valida"),
  password: z.string().min(1, "Password obbligatoria"),
})

type LoginFormData = z.infer<typeof loginFormSchema>

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await AuthService.login(data)
      toast.success("Accesso effettuato con successo")
      navigate("/")
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Errore del server, riprova!"
      )
    }
  }

  return (
    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <div className='space-y-1'>
        <Label htmlFor='userEmail' className='leading-5'>Email Adress*</Label>
        <Input type='email' id='userEmail' placeholder='Enter your email address' {...register("email")} />
        {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className='w-full space-y-1'>
        <Label htmlFor='password' className='leading-5'>Password*</Label>
        <div className='relative'>
          <Input id='password' type={isVisible ? 'text' : 'password'} placeholder='••••••••••••••••' className='pr-9' {...register("password")} />
          <Button variant='ghost' size='icon' type='button'
            onClick={() => setIsVisible(prev => !prev)} className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'>
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </div>
        {errors.password && <p className='text-sm text-destructive'>{errors.password.message}</p>}
      </div>

      <Button className='w-full' type='submit' disabled={isSubmitting}>
        {isSubmitting ? "Accesso in corso..." : "Accedi"}
      </Button>
    </form>
  )
}

export default LoginForm
