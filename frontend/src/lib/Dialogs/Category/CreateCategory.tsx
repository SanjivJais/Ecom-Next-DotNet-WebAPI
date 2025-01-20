import { AlertProps, ErrorAlert } from "@/components/alerts"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCategory } from "@/lib/APIs/category"
import { CustomError } from "@/lib/interfaces"
import useCategoryStore from "@/stores/categoryStore"
import { useState } from "react"
import { toast } from "sonner"

interface CreateCategoryProps {
    isOpen: boolean,
    setIsOpen: (state: boolean) => void
}


export const CreateCategory = ({ isOpen, setIsOpen }: CreateCategoryProps) => {
    
    const [categoryDetails, setCategoryDetails] = useState({
        name: "",
        description: ""
    })

    const [errors, setErrors] = useState<AlertProps[]>([]);
    const [loading, setLoading] = useState(false)
    const { categories, setCategories } = useCategoryStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCategoryDetails({
            ...categoryDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleCreate = async () => {
        if (!categoryDetails.name) {
            setErrors(errors => [...errors, { description: "Category name is required" }])
            return
        } else {
            setErrors([])
        }
        setLoading(true)
        try {
            // Create category
            const response = await createCategory(categoryDetails.name, categoryDetails.description)
            if (response.success) {
                toast.success("Category created!")
                setCategories([...categories, response.data])
            }
        } catch (error) {
            toast.error((error as CustomError).response?.data.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <Dialog>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create category</DialogTitle>
                    <DialogDescription>
                        Add new category details. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-4">
                    {errors?.map((error, index) =>
                        <ErrorAlert key={index} title={error.title} description={error.description} />
                    )
                    }
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="catName" className="">
                            Category name
                        </Label>
                        <Input
                            onChange={handleChange}
                            type="text"
                            id="catName"
                            value={categoryDetails.name}
                            placeholder="Electronics"
                            name="name"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="catDescription" className="">
                            Description
                        </Label>
                        <Textarea
                            id="catDescription"
                            value={categoryDetails.description}
                            onChange={handleChange}
                            name="description"
                            placeholder="Describe your category..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={loading} onClick={handleCreate}>{loading ? "Creating..." : "Create"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
