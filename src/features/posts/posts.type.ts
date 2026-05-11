export type Comment = {
    id: string
    comment: string
    firstName: string
    lastName: string
    avatarUrl: string | null
    likes: number
    userLikeId: number | null
}

export type SocialPost = {
    id: string
    author: {
        id: string
        firstName: string
        lastName: string
        email: string
        avatarUrl: string | null
    }
    img: string | null
    title: string
    description: string
    location: string
    country: string
    likes: number
    userLikeId: number | null
    comments: Comment[]
    createdAt: string
}

export type CreatePostPayload = {
    title: string
    location: string
    country: string
    description: string
    img?: File | null
}

export type UpdatePostPayload = {
    title?: string
    location?: string
    country?: string
    description?: string
    img?: File | null
}
