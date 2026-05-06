import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { Toaster } from "sonner"
import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import WebSiteLayout from "./layouts/website-layout"
import HomePage from "./pages/home-page"
import AuthLayout from "./layouts/auth-layout"
import LoginPage from "./pages/login-page"
import RegisterPage from "./pages/register-page"
import Error from "./components/shadcn-studio/blocks/error-page-01/error-page-01"
import ContactUsPage from "./pages/contact_us-page"
import UserPage from "./pages/user-page"
import ForgotPasswordPage from "./pages/forgot-password-page"
import ResetPasswordPage from "./pages/reset-password-page"


const client = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <WebSiteLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/contact-us",
        element: <ContactUsPage />,
      },
      {
        path: "/user",
        element: <UserPage />,
      },
      {
        path: "/user/:id",
        element: <UserPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/password-recovery",
        element: <ResetPasswordPage />,
      },
    ],
  },
])


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)
