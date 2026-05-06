import type { SocialPost } from "@/features/posts/posts.type"

export type UpdateUserPayload = {
    firstName?: string
    lastName?: string
    password?: string
    password_confirmation?: string
}

export type User = {
    id: string
    firstName: string
    lastName: string
    email: string
    emailVerifiedAt: Date | null
    createdAt: Date
}

export type UserProfile = {
    id: string
    firstName: string
    lastName: string
    email: string
    avatarUrl: string | null
    createdAt: string
    posts: SocialPost[]
}
