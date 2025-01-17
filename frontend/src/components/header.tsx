"use client"
import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { Separator } from './ui/separator'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart } from "lucide-react"
import useAuthStore from "@/stores/authStore"
import { removeToken } from "@/utils/token"

export const AppHeader = () => {

    const { user, clearUser } = useAuthStore()

    const logOutUser = () => {
        clearUser()
        removeToken();
        // reload page
        window.location.reload();
    }

    const getFirstLetters = (name: string): string => {
        const names = name.split(" ");
        let initials = "";
        for (let i = 0; i < names.length; i++) {
            initials += names[i].charAt(0);
        }
        return initials.toUpperCase();
    };

    return (
        <header className="flex h-16 shadow-sm shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="w-full flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger size="icon" className="hover:bg-transparent" />
                    <Separator orientation="vertical" className="mr-2 h-4" />

                </div>

                <nav className="ml-auto hidden lg:flex gap-6">

                    <Link
                        href="/cart"
                        className="group flex items-center gap-1 h-9 w-max justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                        prefetch={false}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </Link>


                    {user && <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>{user && getFirstLetters(user.name)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-44">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={'/profile'}><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            {user?.role.toLowerCase() === 'admin' && <><DropdownMenuSeparator /> <Link href={'/admin'}><DropdownMenuItem>Admin Panel</DropdownMenuItem></Link></>}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => logOutUser()} >Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>}

                    {!user && <Link href="/login" prefetch={false}>
                        <Button
                            variant="default"
                            size="default"
                        >
                            Login
                        </Button>
                    </Link>}
                </nav>
            </div>
        </header>
    )
}
