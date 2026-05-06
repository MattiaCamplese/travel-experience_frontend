import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { User } from "@/features/users/users.type"

export type AuthStore = {
    user: User | undefined
    token: string
    login: (user: User, token: string) => void
    logout: () => void
    updateUser: (partial: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: undefined,
            token: "",
            login(user, token) {
                set({ user, token })
            },
            logout() {
                set({ user: undefined, token: "" })
            },
            updateUser(partial) {
                set((state) => ({ user: state.user ? { ...state.user, ...partial } : state.user }))
            },
        }),
        {
            name: "authStore",
            storage: createJSONStorage(() => localStorage),
        }
    )
)
