

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";




export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <nav>
                <Navbar/>
            </nav>
            {children}

            <footer>
                <Footer/>
            </footer>
        </div>
    );
}
