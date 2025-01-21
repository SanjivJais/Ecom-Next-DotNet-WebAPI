"use client"
import React from 'react'
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/header";

function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const navMain = [
        {
            title: "Home",
            url: "/",
            icon: "Home",
            isActive: true,
        },
        {
            title: "Products",
            url: "#",
            icon: "Box",
        },
        {
            title: "Categories",
            url: "#",
            icon: "Grid",
        },
    ]


    return (
        <div className="min-h-screen w-full flex flex-col">
            <main className="flex-1">
                <SidebarProvider>
                    <AppSidebar navMainData={navMain} />
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

export default UserLayout