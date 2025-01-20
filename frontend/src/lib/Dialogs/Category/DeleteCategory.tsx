import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteCategory } from "@/lib/APIs/category";
import { Category, CustomError } from "@/lib/interfaces";
import useCategoryStore from "@/stores/categoryStore"
import { useState } from "react";
import { toast } from "sonner";

interface DeleteCategoryProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void,
    category: Category
}

export function DeleteCategory({ isOpen, setIsOpen, category }: DeleteCategoryProps) {

    const { categories, setCategories } = useCategoryStore();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {

        setLoading(true);
        try {
            const response = await deleteCategory(category.categoryId);
            if (response.success) {
                setCategories(categories.map(cat => cat.categoryId === category.categoryId ? response.data : cat));
                toast.success("Category deleted successfully!");
                setIsOpen(false); // Close the dialog
            }
        } catch (error) {
            toast.error((error as CustomError).response?.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete &#34;{category.name}&#34; category?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this category? It cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={loading} onClick={handleDelete} className="">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
