import { http } from "@/lib/http"

type StoreCommentPayload = {
    user_id: string
    post_id: string
    comment: string
}

export class CommentsService {
    static async store(payload: StoreCommentPayload) {
        const res = await http.post("/comments", payload)
        return res.data
    }
}
