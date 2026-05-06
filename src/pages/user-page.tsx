import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router"
import { useAuthStore } from "@/features/auth/auth.store"
import { UsersService } from "@/features/users/users.service"
import UserProfileComponent from "@/components/shadcn-studio/blocks/user-profile-01/user-profile-01"
import { Loader2 } from "lucide-react"

const UserPage = () => {
  const { user } = useAuthStore()
  const { id } = useParams()

  const targetId = id ?? user?.id

  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ["user", targetId],
    queryFn: () => UsersService.show(targetId!),
    enabled: !!targetId,
  })

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-white">
        <p className="text-lg">Devi essere autenticato per vedere il profilo.</p>
        <Link to="/login" className="rounded-full bg-white/20 border border-white/40 px-6 py-2 text-sm font-medium hover:bg-white/30 transition">
          Accedi
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40 text-white">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="flex items-center justify-center py-40 text-white">
        <p>Errore nel caricamento del profilo.</p>
      </div>
    )
  }

  const isOwner = !id || id === user?.id

  return <UserProfileComponent profile={profile} isOwner={isOwner} onPostCreated={refetch} />
}

export default UserPage
