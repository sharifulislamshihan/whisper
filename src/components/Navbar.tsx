"use client"

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {User} from 'next-auth'

const Navbar = () => {

    const {data: session} = useSession()

    const user: User = session?.user
    return (
        <nav>
    );
};

export default Navbar;