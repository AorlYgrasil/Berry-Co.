import './globals.css'
import Navbar from '../components/ui/navbar'
import Footer from '../components/ui/footer'
import Hero from '../components/ui/hero'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return(
        <html lang="en">
            <body>
                <Navbar />

                <main><Hero /></main>

                <Footer />
            </body>
        </html>
    )
}