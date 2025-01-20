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
import { updateCategory } from "@/lib/APIs/category"
import { Category, CustomError } from "@/lib/interfaces"
import useCategoryStore from "@/stores/categoryStore"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface UpdateCategoryProps {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
    category: Category
}


export const UpdateCategory = ({ isOpen, setIsOpen, category }: UpdateCategoryProps) => {

    const [updatedCategory, setUpdatedCategory] = useState(category)

    const [errors, setErrors] = useState<AlertProps[]>([]);
    const [loading, setLoading] = useState(false)
    const { categories, setCategories } = useCategoryStore();


    // Reset form state when `isOpen` becomes true
    useEffect(() => {
        if (isOpen) {
            setUpdatedCategory(category);
            setErrors([]);
            setLoading(false);
        }
    }, [isOpen]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUpdatedCategory({
            ...updatedCategory,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = async () => {
        if (!updatedCategory.name || updatedCategory.name.length < 3) {
            setErrors(errors => [...errors, { description: "Category name must be at least 3 characters!" }])
            return
        } else {
            setErrors([])
        }
        setLoading(true)
        try {
            // Create category
            const response = await updateCategory(category.categoryId, updatedCategory.name, updatedCategory.description)
            if (response.success) {
                toast.success("Category updated!")
                setCategories(categories.map(cat => cat.categoryId === category.categoryId ? response.data : cat))
            }
            setIsOpen(false)
        } catch (error) {
            toast.error((error as CustomError).response?.data.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update category</DialogTitle>
                    <DialogDescription>
                        Change category details and save when you're done.
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
                            value={updatedCategory.name}
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
                            value={updatedCategory.description}
                            onChange={handleChange}
                            name="description"
                            placeholder="Describe your category..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={loading} onClick={handleUpdate}>{loading ? "Updating..." : "Update"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
