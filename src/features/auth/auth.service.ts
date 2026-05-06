import { http } from "@/lib/http"
import { useAuthStore } from "./auth.store"
import type { User } from "@/features/users/users.type"
import type { loginFormSchema } from "@/components/shadcn-studio/blocks/login-page-01/login-form"
import type { registerSchema } from "@/components/shadcn-studio/blocks/register-01/register-form"
import type { z } from "zod"

export class AuthService {
    static async login(data: z.infer<typeof loginFormSchema>) {
        const res = await http.post<{ user: User; token: string }>("/login", data)
        const { user, token } = res.data
        useAuthStore.getState().login(user, token)
        return res.data
    }

    static async register(data: z.infer<typeof registerSchema>) {
        const res = await http.post<{ user: User }>("/register", data)
        return res.data
    }

    static async me() {
        const res = await http.get<User>("/me")
        return res.data
    }

    static async logout() {
        await http.delete("/logout")
        useAuthStore.getState().logout()
    }

    static async verifyEmail(data: { email: string; code: string }) {
        const res = await http.post<{ token: string; user: User }>(
            "/auth/email-verify",
            data
        )
        if (res.data.token) {
            useAuthStore.getState().login(res.data.user, res.data.token)
        }
        return res
    }

    static async resendEmailVerify(email: string) {
        return http.post("/auth/resend-email-verify", { email })
    }

    static async sendPasswordRecovery(email: string) {
        return http.post("/auth/send-password-recovery", { email })
    }

    static async passwordRecovery(data: { email: string; token: string; password: string; passwordConfirmation: string }) {
        return http.post("/auth/password-recovery", data)
    }
}
