
import LoginForm from "@/components/shadcn-studio/blocks/login-page-01/login-form"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router"

const LoginPage = () => {
  return (
    <div className="space-y-1">
      <CardHeader className='gap-6'>
        {/* <InkLogo /> */}
        <div>
          <CardTitle className='   text-2xl'>Entra In Travel Experience</CardTitle>
          <CardDescription className='text-base'>Inserisci Email e Password per Accedere</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {/* Login Form */}
        <div className='space-y-4'>
          <LoginForm />

          <p className='text-center text-sm text-muted-foreground'>
            <Link to="/forgot-password" className="text-pink-500 hover:underline">
              Password dimenticata?
            </Link>
          </p>

          <p className='text-center text-muted-foreground'> Sei Nuovo? {""}
            <Link to="/register" className=" text-gray-700 px-1 py-1 border bg-pink-300 rounded-full text-card-forground hover:underline">Crea Account
            </Link>
          </p>
        </div>
      </CardContent>
    </div>
  )
}

export default LoginPage