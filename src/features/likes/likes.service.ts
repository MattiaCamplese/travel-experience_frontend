import { http } from "@/lib/http"

export class LikesService {
    static async store(user_id: string, post_id: string): Promise<{ id: number }> {
        const res = await http.post<{ data: { id: number } }>("/likes", { user_id, post_id })
        return res.data.data
    }

    static async destroy(like_id: number) {
        await http.delete(`/likes/${like_id}`)
    }
}
