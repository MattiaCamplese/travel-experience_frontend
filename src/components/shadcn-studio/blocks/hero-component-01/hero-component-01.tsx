import { useState } from 'react'
import { CogIcon, LogOutIcon, MenuIcon, UserRoundIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/features/auth/auth.store'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import UpdateUserModal from '@/components/shadcn-studio/blocks/update-user-01/update-user-01'


type NavigationItem = {
  title: string
  href: string
}

type HeaderProps = {
  navigationData: NavigationItem[]
}

const Header = ({ navigationData }: HeaderProps) => {
  const { user, logout } = useAuthStore()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
    <header className='bg-white/60 backdrop-blur-sm sticky top-0 z-50 border-b border-border font-sans'>
      <div className='mx-auto flex max-w-screen-2xl items-center justify-between gap-8 px-4 py-4 sm:px-6'>

        {/* Logo */}
        <Link to='/' className='flex items-center gap-2 '>
          <img src='/logo.png' alt='Travel-Experience' className='w-auto max-h-8.5 object-contain mix-blend-multiply' />
          <span className='text-lg font-bold  text-zinc-800'>Travel-Experience</span>
        </Link>

        {/* Nav centrale */}
        <nav className=' hidden items-center gap-8 font-medium md:flex text-gray-800'>
          {navigationData.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className='hover:text-foreground transition-colors capitalize'
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-3'>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className='cursor-pointer'>
                <div className="flex items-center gap-2">
                  <Avatar className="bg-white border-2 border-white text-sm font-medium font-[Inter]">
                    <AvatarImage src={user.avatarUrl ?? undefined} />
                  </Avatar>
                  <span className="text-base font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem render={<Link to='/user' />}>
                  <UserRoundIcon />
                  Profilo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                  <CogIcon />
                  Impostazioni
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOutIcon />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant='outline' className='max-sm:hidden' render={<Link to='/login' />} nativeButton={false}>
                Login
              </Button>
              <Button className='max-sm:hidden' render={<Link to='/register' />} nativeButton={false}>
                Register
              </Button>
            </>
          )}

          {/* Mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className='md:hidden' render={<Button variant='outline' size='icon' />}>
              <MenuIcon />
              <span className='sr-only'>Menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end'>
              <DropdownMenuGroup>
                {navigationData.map((item) => (
                  <DropdownMenuItem key={item.href} render={<Link to={item.href} />}>
                    {item.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>

      {settingsOpen && <UpdateUserModal onClose={() => setSettingsOpen(false)} />}
    </>
  )
}

export default Header
