import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import { PenLine } from "lucide-react"
import { PostPerPage } from "@/pages/post-home"
import CreatePostModal from "@/components/shadcn-studio/blocks/create-post-01/create-post-01"
import { useAuthStore } from "@/features/auth/auth.store"

const HomePage = () => {
    const { user } = useAuthStore()
    const queryClient = useQueryClient()
    const [, setSearchParams] = useSearchParams()
    const [modalOpen, setModalOpen] = useState(false)

    const handleCreated = () => {
        setSearchParams({ page: "1" })
        queryClient.invalidateQueries({ queryKey: ['posts'] })
    }

    return (
        <>
            <PostPerPage />
            {user && (
                <button onClick={() => setModalOpen(true)} className="fixed bottom-8 right-8 z-60 flex items-center gap-2 rounded-full bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-pink-600 active:scale-95 transition-all duration-200">
                    <PenLine className="size-4" />
                    Crea post
                </button>
            )}

            {modalOpen && (
                <CreatePostModal
                    onClose={() => setModalOpen(false)}
                    onCreated={handleCreated}
                />
            )}
        </>
    )
}

export default HomePage
