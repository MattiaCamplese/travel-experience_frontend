import Footer from "@/components/shadcn-studio/blocks/footer-component-01/footer-component-01"
import Header from "@/components/shadcn-studio/blocks/hero-component-01/hero-component-01"
import { Outlet } from "react-router"

const navigationData = [
    {
        title: "Home",
        href: '/'
    },
    {
        title: "Profilo",
        href: '/user'
    },
    
    {
        title: "Contact Us",
        href: '/contact-us'
    }
]

const WebSiteLayout = () => {
    return (
        <div className="flex min-h-dvh w-full flex-col">
            <Header navigationData={navigationData} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer navigationData={navigationData} />
        </div>
    )
}

export default WebSiteLayout
