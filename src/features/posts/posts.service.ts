import { http, type PaginatedResponse } from "@/lib/http"
import type { SocialPost, CreatePostPayload, UpdatePostPayload } from "@/features/posts/posts.type"


export class PostsService {
    static async list(props: { page?: string } = {}) {
        const { page = "1" } = props
        const res = await http.get<PaginatedResponse<SocialPost>>(`/posts?page=${page}`)
        return res.data
    }

    static async store(payload: CreatePostPayload): Promise<SocialPost> {
        const { useAuthStore } = await import("@/features/auth/auth.store")
        const user = useAuthStore.getState().user
        if (!user) throw new Error("Utente non autenticato")
        const form = new FormData()
        form.append("user_id", user.id)
        form.append("title", payload.title)
        form.append("location", payload.location)
        form.append("country", payload.country)
        form.append("description", payload.description)
        if (payload.img) form.append("img", payload.img)
        const res = await http.post<{ data: SocialPost }>("/posts", form)
        return res.data.data
    }

    static async update(postId: string, payload: UpdatePostPayload): Promise<SocialPost> {
        const form = new FormData()
        form.append("_method", "PUT")
        if (payload.title !== undefined) form.append("title", payload.title)
        if (payload.location !== undefined) form.append("location", payload.location)
        if (payload.country !== undefined) form.append("country", payload.country)
        if (payload.description !== undefined) form.append("description", payload.description)
        if (payload.img) form.append("img", payload.img)
        const res = await http.post<{ data: SocialPost }>(`/posts/${postId}`, form)
        return res.data.data
    }
}
