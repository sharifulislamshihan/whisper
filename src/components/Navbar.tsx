"use client"

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from 'next-auth'
import { Button } from "./ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)
    const { data: session } = useSession()
    const router = useRouter()

    const user: User = session?.user as User


    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/feedback', label: 'Feedback' },
    ]
    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="w-40 flex-shrink-0 flex items-center">
                        <Link href="/">
                            <Image 
                            src="https://res.cloudinary.com/drdgi9qdu/image/upload/v1727289698/SC7XrUHmR5CIgmQ-XWvE5Q-removebg-preview_rso636.png" 
                            alt="Whisper Logo"
                            width={500}
                            height={500}
                            layout="responsive" />
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link href="/signin" passHref>
                            <Button variant="outline" className="ml-4 bg-purple-100 text-purple-600 border-purple-300 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-800">
                                Signin
                            </Button>
                        </Link>
                    </div>
                    <div className="md:hidden flex items-center">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col space-y-4 mt-8">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-lg font-medium"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                    <Link href="/signin" passHref onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                                            Signin
                                        </Button>
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;