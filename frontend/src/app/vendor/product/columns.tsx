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
import { Product } from "@/lib/interfaces"
import { useState } from "react"
// import { UpdateCategory } from "@/lib/Dialogs/Category/UpdateCategory"
// import { DeleteCategory } from "@/lib/Dialogs/Category/DeleteCategory"

export const columns: ColumnDef<Product>[] = [
    {
        header: "SN",
        cell: ({ row }) => {
            return <div>{row.index + 1}</div>
        }
    },
    {
        accessorKey: "imageUrl",
        header: () => <div className="">Image</div>,
        cell: ({ row }) => {
            return <img src={row.getValue("imageUrl")} className="h-12 w-12 rounded-full" />
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
        header: () => <div className="">Description</div>,
        cell: ({ row }) => {
            return <p className="truncate">{row.getValue("description")}</p>
        }
    },
    {
        accessorKey: "price",
        header: () => <div className="">Price (NPR)</div>,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US").format(price)

            return <div className=" font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "stock",
        header: () => <div className="">Stock</div>,
    },
    {
        accessorKey: "category",
        header: () => <div className="">Category</div>,
        cell: ({ row }) => {
            const categoryName = row.original.category.name
            return <div>{categoryName}</div>
        }
    },
    {
        accessorKey: "createdAt",
        header: "CreatedAt",
        cell: ({ row }) => {
            return <div>{new Date(row.getValue("createdAt")).toLocaleString().slice(0, 9)}</div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original
            // const [editOpen, setEditOpen] = useState(false)
            // const [deleteOpen, setDeleteOpen] = useState(false)
            // if (category.name === "Uncategorized" || category.isDeleted) return null
            return (<>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    {/* <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditOpen(true)} className="focus:cursor-pointer">Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="focus:bg-red-500 text-red-500 focus:text-white focus:cursor-pointer">Delete</DropdownMenuItem>
                    </DropdownMenuContent> */}
                </DropdownMenu>
                {/* <UpdateCategory category={category} setIsOpen={setEditOpen} isOpen={editOpen} />
                <DeleteCategory category={category} setIsOpen={setDeleteOpen} isOpen={deleteOpen} /> */}
            </>
            )
        },
    },
]
