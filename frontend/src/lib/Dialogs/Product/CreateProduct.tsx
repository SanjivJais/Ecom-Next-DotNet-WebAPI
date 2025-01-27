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
import { CustomError } from "@/lib/interfaces"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface CreateProductProps {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}


export const CreateProduct = ({ isOpen, setIsOpen }: CreateProductProps) => {

    const [productDetails, setProductDetails] = useState({
        
    })

    const [errors, setErrors] = useState<AlertProps[]>([]);
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([]);

    // Reset form state when `isOpen` becomes true
    useEffect(() => {
        if (isOpen) {
            setProductDetails({
                
            });
            setErrors([]);
            setLoading(false);
        }
    }, [isOpen]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleCreate = async () => {
        // if (!productDetails.name) {
        //     setErrors(errors => [...errors, { description: "Category name is required" }])
        //     return
        // } else {
        //     setErrors([])
        // }
        setLoading(true)
        try {
            // Create product
            
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
                    <DialogTitle>Create product</DialogTitle>
                    <DialogDescription>
                        Add new product details. Click save when you're done.
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
                            // value={productDetails.name}
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
                            // value={productDetails.description}
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
