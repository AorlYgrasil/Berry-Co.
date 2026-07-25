import './globals.css'
import Navbar from '../components/ui/navbar'
import Footer from '../components/ui/footer'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return(
        <html lang="en">
            <body>
                <Navbar />

                <main>{children}</main>

                <Footer />
            </body>
        </html>
    )
}