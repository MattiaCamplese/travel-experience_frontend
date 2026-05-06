import { SiFacebook, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router'

type NavigationItem = {
  title: string
  href: string
}

type FooterProps = {
  navigationData: NavigationItem[]
}

const Footer = (props: FooterProps) => {
  const { navigationData } = props;
  return (
    <footer id="site-footer" className='bg-pink-400/40 backdrop-blur-sm sticky bot-0 z-50 border-b border-border'>
      <div className='mx-auto flex max-w-screen-2xl items-center justify-between gap-2 px-4 py-2 max-md:flex-col sm:px-6 md:gap-6'>
        <Link to='/'>
          <div className='flex items-center gap-3'>
            <img src='/logo.png' alt='Travel-Experience' className='w-auto max-h-9 object-contain mix-blend-multiply' />
            <span className='text-lg font-bold text-white'>Travel-Experience</span>
          </div>
        </Link>

         <nav className=' hidden items-center gap-8 font-medium md:flex text-white'>
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

        <div className='flex items-center gap-4'>
          <a href='#' target='_blank'>
            <SiFacebook className='size-5 text-white' />
          </a>
          <a href='#' target='_blank'>
            <SiInstagram className='size-5 text-white' />
          </a>
          <a href='#' target='_blank'>
            <SiX className='size-5 text-white' />
          </a>
          <a href='#' target='_blank'>
            <SiYoutube className='size-5 text-white' />
          </a>
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl justify-center px-4 py-2 sm:px-6 text-white'>
        <p className='text-center font-medium text-balance'>
          {`©${new Date().getFullYear()}`}{' '}
          <a href='#' className='hover:underline'>
            Mattia Studio
          </a>
          , Made with ❤️ for better web.
        </p>
      </div>
    </footer>
  )
}

export default Footer