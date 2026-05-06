import { useEffect, useRef, useState } from "react"
import { Heart, FileText, Mail, CalendarDays, MapPin, Pencil, PenLine } from "lucide-react"
import { PostPage as PostCard } from "@/pages/post-home"
import type { UserProfile as UserProfileData } from "@/features/users/users.type"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UsersService } from "@/features/users/users.service"
import CreatePostModal from "@/components/shadcn-studio/blocks/create-post-01/create-post-01"

/* ── Stat card ────────────────────────────────────────── */

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: number
}) => (
  <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/60 shadow-sm px-8 py-5 w-36">
    <Icon className="size-5 text-pink-500" />
    <span className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</span>
    <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
  </div>
)

/* ── Profile header ───────────────────────────────────── */

const ProfileHeader = ({ profile, isOwner }: { profile: UserProfileData; isOwner: boolean }) => {
  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase()
  const totalLikes = profile.posts.reduce((sum: number, p) => sum + p.likes, 0)
  const memberSince = new Date(profile.createdAt).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarSrc, setAvatarSrc] = useState<string | null>(profile.avatarUrl)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setAvatarSrc(preview)
    try {
      const url = await UsersService.updateAvatar(profile.id, file)
      setAvatarSrc(url)
    } catch {
      setAvatarSrc(profile.avatarUrl)
    } finally {
      URL.revokeObjectURL(preview)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-12 px-4">
      {/* Avatar */}
      <div className="relative group">
        <Avatar className="h-28 w-28 shadow-lg ring-4 ring-white">
          <AvatarImage src={avatarSrc ?? `https://api.dicebear.com/9.x/rings/svg?seed=${encodeURIComponent(profile.email)}`} />
          <AvatarFallback className="bg-pink-200 text-2xl font-bold text-pink-700">{initials}</AvatarFallback>
        </Avatar>
        {isOwner && (
          <>
            <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" >
              <Pencil className="size-6 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}
        <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-400 ring-2 ring-white" />
      </div>

      {/* Name + meta */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow">
          {profile.firstName} {profile.lastName}
        </h1>
        <div className="mt-2 flex flex-col items-center gap-1 text-white/80 text-sm">
          <span className="flex items-center gap-1.5">
            <Mail className="size-3.5" />
            {profile.email}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            Membro da {memberSince}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 flex-wrap justify-center">
        <StatCard icon={FileText} label="Post" value={profile.posts.length} />
        <StatCard icon={Heart} label="Like ricevuti" value={totalLikes} />
        <StatCard
          icon={MapPin}
          label="Paesi visitati"
          value={new Set(profile.posts.map((p: { country: string }) => p.country)).size}
        />
      </div>
    </div>
  )
}

/* ── Posts grid ───────────────────────────────────────── */

const UserPostsGrid = ({ profile }: { profile: UserProfileData }) => {
  const sorted = [...profile.posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  if (sorted.length === 0) return null

  return (
    <section className="pb-16">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        <h2 className="mb-6 text-xl font-bold text-white">
          I miei viaggi
          <span className="ml-2 rounded-full bg-white/20 px-2.5 py-0.5 text-sm font-medium">
            {sorted.length}
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Page ─────────────────────────────────────────────── */

const UserProfile = ({
  profile,
  isOwner,
  onPostCreated,
}: {
  profile: UserProfileData
  isOwner: boolean
  onPostCreated?: () => void
}) => {
  const [createOpen, setCreateOpen] = useState(false)
  const [btnBottom, setBtnBottom] = useState(32)

  useEffect(() => {
    const footer = document.getElementById("site-footer")
    if (!footer) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setBtnBottom(entry.isIntersecting ? entry.intersectionRect.height + 16 : 32)
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen">
      <ProfileHeader profile={profile} isOwner={isOwner} />
      <UserPostsGrid profile={profile} />

      {isOwner && (
        <>
          <button
            onClick={() => setCreateOpen(true)}
            style={{ bottom: btnBottom }}
            className="fixed right-8 z-60 flex items-center gap-2 rounded-full bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-pink-600 active:scale-95 transition-all duration-200"
          >
            <PenLine className="size-4" />
            Crea post
          </button>

          {createOpen && (
            <CreatePostModal
              onClose={() => setCreateOpen(false)}
              onCreated={() => {
                setCreateOpen(false)
                onPostCreated?.()
              }}
            />
          )}
        </>
      )}
    </div>
  )
}

export default UserProfile
