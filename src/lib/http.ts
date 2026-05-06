import axios from "axios"
import { myEnv } from "./env"
import { useAuthStore } from "@/features/auth/auth.store"

export const http = axios.create({
    baseURL: myEnv.backedndApiUrl,
})

export type PaginatedResponse<T> = {
    data: T[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
    links: {
        first: string | null
        last: string | null
        prev: string | null
        next: string | null
    }
}

// Inietta automaticamente il token Bearer su ogni richiesta
http.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
