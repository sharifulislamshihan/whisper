'use client';


import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/context/AuthProvider";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Specify the paths where you do not want Navbar
    const noLayoutPaths = ["/u", "/dashboard", "/verify", "/auth"];

    // Function to check if the current path should exclude the Navbar
    const shouldHideLayout = noLayoutPaths.some(path => pathname.startsWith(path));

    return (
        <html lang="en">
            <head>

                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
            </head>
            <body className={inter.className}>
                <AuthProvider>
                    {!shouldHideLayout && <Navbar />}
                    {children}
                    <Toaster />
                </AuthProvider>
            </body>
        </html>
    );
}

