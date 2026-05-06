import AuthBackgroundShape from "@/assets/svg/auth-background-shape"
import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/features/auth/auth.store"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"

const AuthLayout = () => {
  const router = useNavigate()
  const token = useAuthStore(state => state.token)

  useEffect(() => {
    if (token) {
      router("/")
    }
  }, [])

  if (token) {
    return
  }

  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>

      <Card className="z-1 w-full border-none shadow-md sm:max-w-lg">
        <Outlet />
      </Card>
    </div>
  )
}

export default AuthLayout
