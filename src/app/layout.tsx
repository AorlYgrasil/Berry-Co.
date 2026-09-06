import './globals.css'
import { headers } from 'next/headers'
import Navbar from '../components/ui/navbar'
import Footer from '../components/ui/footer'

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = (await headers()).get('x-pathname') ?? ''
    const isAdminRoute = pathname.startsWith('/admin')

    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col bg-background text-dark">
                {!isAdminRoute && <Navbar />}
                <main className="flex-1 flex flex-col">{children}</main>
                {!isAdminRoute && <Footer />}
            </body>
        </html>
    )
}