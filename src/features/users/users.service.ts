import { http } from "@/lib/http"
import type { UserProfile, UpdateUserPayload } from "@/features/users/users.type"

export class UsersService {
    static async show(userId: string): Promise<UserProfile> {
        const res = await http.get<{ data: UserProfile }>(`/users/${userId}`)
        return res.data.data
    }

    static async update(userId: string, payload: UpdateUserPayload): Promise<UserProfile> {
        const res = await http.put<{ data: UserProfile }>(`/users/${userId}`, payload)
        return res.data.data
    }

    static async updateAvatar(userId: string, file: File): Promise<string> {
        const form = new FormData()
        form.append("avatar", file)
        const res = await http.post<{ data: { avatarUrl: string } }>(`/users/${userId}/avatar`, form)
        return res.data.data.avatarUrl
    }
}
