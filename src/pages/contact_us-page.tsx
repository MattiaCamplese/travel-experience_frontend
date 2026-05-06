import { Clock8Icon, MapPinIcon, BriefcaseBusinessIcon, PhoneIcon } from 'lucide-react'

import ContactUs from '@/components/shadcn-studio/blocks/contact-us-page-01/contact-us-page-01'

const contactInfo = [
  {
    title: "Orario d'ufficio",
    icon: Clock8Icon,
    description: 'Lunedi-Venerdi\ndalle 8:00 alle 17:00'
  },
  {
    title: 'Posizione',
    icon: MapPinIcon,
    description: 'Circolo Tennis Penne (PE), IT'
  },
  {
    title: 'Ufficio 2',
    icon: BriefcaseBusinessIcon,
    description: 'Circolo Tennis Penne (PE), IT'
  },
  {
    title: 'Whatsapp',
    icon: PhoneIcon,
    description: '3932898333'
  }
]

const ContactUsPage = () => {
  return <ContactUs contactInfo={contactInfo} />
}

export default ContactUsPage