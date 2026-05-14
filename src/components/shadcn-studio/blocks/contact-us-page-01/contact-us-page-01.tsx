import type { ComponentType } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type ContactInfo = {
  title: string
  icon: ComponentType
  description: string
}[]

const ContactUs = ({ contactInfo }: { contactInfo: ContactInfo }) => {
  return (
    <section className='w-full py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mx-auto mb-8 w-fit sm:mb-12'>
          <h2 className='text-2xl font-bold md:text-3xl lg:text-4xl text-white'>Contact Us</h2>
        </div>

        <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-20'>
          <img
            src='/logo.png'
            alt='Logo'
            className='w-full rounded-md object-contain max-h-56 sm:max-h-80 lg:max-h-125'
          />

          <div className='w-full'>
            <h3 className='text-white mb-4 text-xl sm:text-2xl font-semibold text-center'>Felici di aiutarvi!</h3>
            <p className='text-white mb-8 text-base sm:text-lg font-medium'>
              Travel Experience è felice di aiutarvi a mostrare le vostre fantastiche esperienze, se avete avuto qualche problema contattateci come preferite
            </p>

            {/* Contact Info Grid */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {contactInfo.map((info, index) => (
                <Card className='text-black border-none shadow-none bg-pink-400/40' key={index}>
                  <CardContent className='flex flex-col items-center gap-3 text-center p-4'>
                    <Avatar className='size-9 border'>
                      <AvatarFallback className='bg-transparent [&>svg]:size-5 text-white'>
                        <info.icon />
                      </AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <h4 className='text-base font-semibold'>{info.title}</h4>
                      <div className='text-sm font-medium text-black'>
                        {info.description.split('\n').map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUs
