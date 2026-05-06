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
    <section className='bg-pink-200/0 py-4 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='relative mx-auto mb-12 w-fit sm:mb-16'>
          <h2 className='text-2xl font-bold md:text-3xl lg:text-4xl text-white'>Contact Us</h2>
        </div>

        <div className='grid items-center gap-24 lg:grid-cols-2'>
          <img src='/logo.png' alt='Logo'className='size-full rounded-md object-contain max-lg:max-h-[500px]'
/>

          <div className='min-w-2xl'>
            <h3 className='text-white mb-6 text-2xl font-semibold text-center'>Felici di aiutarvi!</h3>
            <p className='text-white mb-10 text-lg font-medium'>
                Travel Experience e' felice di aiutarvi a mostrare le vostre fantastiche esperienze, se avete avuto qualche problema contattateci come preferite
            </p>

            {/* Contact Info Grid */}
            <div className='grid gap-6 sm:grid-cols-2'>
              {contactInfo.map((info, index) => (
                <Card className='text-black border-none shadow-none bg-pink-400/40' key={index}>
                  <CardContent className='flex flex-col items-center gap-4 text-center'>
                    <Avatar className='size-9 border '>
                      <AvatarFallback className='bg-transparent [&>svg]:size-5 text-white'>
                        <info.icon />
                      </AvatarFallback>
                    </Avatar>
                    <div className='space-y-3 '>
                      <h4 className='text-lg font-semibold '>{info.title}</h4>
                      <div className='text-base font-medium text-black'>
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
