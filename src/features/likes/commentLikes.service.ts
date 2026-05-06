import { http } from "@/lib/http"

export class CommentLikesService {
    static async store(user_id: string, comment_id: string): Promise<{ id: number }> {
        const res = await http.post<{ data: { id: number } }>("/comment-likes", { user_id, comment_id })
        return res.data.data
    }

    static async destroy(like_id: number) {
        await http.delete(`/comment-likes/${like_id}`)
    }
}
