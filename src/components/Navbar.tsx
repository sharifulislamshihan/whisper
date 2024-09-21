"use client"

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from 'next-auth'
import { Button } from "./ui/button";

const Navbar = () => {

    const { data: session } = useSession()

    const user: User = session?.user as User
    return (
        <nav className="bg-white border-b shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/"
                        className="text-xl font-bold"
                        >
                           Logo
                        </Link>
                    </div>

                    {/* Right side buttons */}
                    <div className="flex space-x-4">
                        <Link 
                        href="/feedback"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            
                                Feedback
                        </Link>
                        {
                            session ? (
                                    <Button 
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                    onClick={() => signOut()}>
                                        Logout
                                    </Button>
                                
                            )
                                :
                                (
                                    <Link href="/signin">
                                        <Button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                                            Sign In
                                        </Button>
                                    </Link>
                                )
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;