"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { ModeToggle } from "./theme-toggle"
import { SidebarMenuInterface } from "@/utils/interfaces"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    navMainData: SidebarMenuInterface["items"];
}

export function AppSidebar({ navMainData, ...props }: AppSidebarProps) {
    const { state } = useSidebar()
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {state === "expanded" && <Link href="#" className="mr-6 hidden lg:flex px-4 py-2" prefetch={false}>
                    <h1 className="font-bold text-xl">Logo</h1>
                </Link>}
                {state === "collapsed" && <Link href="#" className="" prefetch={false}>
                    <h1 className="font-bold text-2xl text-center">L</h1>
                </Link>}
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMainData} />
            </SidebarContent>
            <SidebarFooter className="pl-4 pb-4">
                <ModeToggle />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
