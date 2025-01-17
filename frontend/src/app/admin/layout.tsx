"use client"
import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppHeader } from '@/components/header';
import {
    Box,
    ChartArea,
    Users,
} from "lucide-react"

function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const navdata = {
        navMain: [
            {
                title: "Dashboard",
                url: "/admin",
                icon: ChartArea,
            },
            {
                title: "Product",
                url: "#",
                icon: Box,
                isActive: false,
                items: [
                    {
                        title: "Categories",
                        url: "#",
                    },
                ],
            },
            {
                title: "Users",
                url: "#",
                icon: Users,
                items: [
                    {
                        title: "Active users",
                        url: "#",
                    },
                    {
                        title: "Deleted users",
                        url: "#",
                    },
                ],
            },
        ],
    }

    return (
        <div className="min-h-screen w-full flex flex-col">
            <main className="flex-1">
                <SidebarProvider>
                    <AppSidebar navMainData={navdata.navMain} />
                    <SidebarInset className='flex flex-col gap-4'>
                        <AppHeader />
                        <div className='px-4'>
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </main>
        </div>
    )
}

export default AdminLayout