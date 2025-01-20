"use client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Category } from "@/lib/interfaces"
import { useState } from "react"
import { UpdateCategory } from "@/lib/Dialogs/Category/UpdateCategory"
import { DeleteCategory } from "@/lib/Dialogs/Category/DeleteCategory"

export const columns: ColumnDef<Category>[] = [
    {
        header: "SN",
        cell: ({ row }) => {
            return <div>{row.index + 1}</div>
        }
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "description",
        header: () => <div className="">Description</div>
    },
    {
        accessorKey: "isDeleted",
        header: "IsDeleted",
        cell: ({ row }) => {
            return <div className={` ${row.getValue("isDeleted") === true ? "text-red-500" : "text-green-500"} font-bold `}>{row.getValue("isDeleted") ? "Deleted" : "False"}</div>
        }
    },
    {
        accessorKey: "createdAt",
        header: "CreatedAt",
        cell: ({ row }) => {
            return <div>{new Date(row.getValue("createdAt")).toLocaleString()}</div>
        }
    },
    // {
    //     accessorKey: "amount",
    //     header: () => <div className="">Amount</div>,
    //     cell: ({ row }) => {
    //         const amount = parseFloat(row.getValue("amount"))
    //         const formatted = new Intl.NumberFormat("en-US", {
    //             style: "currency",
    //             currency: "USD",
    //         }).format(amount)

    //         return <div className=" font-medium">{formatted}</div>
    //     },
    // },
    {
        id: "actions",
        cell: ({ row }) => {
            const category = row.original
            const [editOpen, setEditOpen] = useState(false)
            const [deleteOpen, setDeleteOpen] = useState(false)
            if (category.name === "Uncategorized" || category.isDeleted) return null
            return (<>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditOpen(true)} className="focus:cursor-pointer">Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="focus:bg-red-500 text-red-500 focus:text-white focus:cursor-pointer">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <UpdateCategory category={category} setIsOpen={setEditOpen} isOpen={editOpen} />
                <DeleteCategory category={category} setIsOpen={setDeleteOpen} isOpen={deleteOpen} />
            </>
            )
        },
    },
]
