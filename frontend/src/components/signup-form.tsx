"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/services/authService"
import { Checkbox } from "./ui/checkbox"
import { CustomError } from "@/utils/interfaces"
import { toast } from "sonner"

export function SignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    const router = useRouter();

    const [isVendor, setIsVendor] = useState(false)
    const [formDetails, setFormDetails] = useState({
        name: "",
        email: "",
        password: "",
        role: "User"
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleCheckBox = (checked: boolean) => {
        setIsVendor(checked)
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            role: checked ? "Vendor" : ""
        }));
    }


    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const signupPromise = async () => {
            await registerUser(formDetails.name, formDetails.email, formDetails.password, formDetails.role)
            router.push("/login");
        };

        toast.promise(signupPromise, {
            loading: "Signing up...",
            success: `Account created successfully!`,
            error: (error: CustomError) => {
                return `${error?.response?.data?.message}`
            }
        });

        setLoading(false);
    };


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Signup</CardTitle>
                    <CardDescription>
                        Enter your details below to register your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formDetails.name}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Full name"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formDetails.email}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Active email"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formDetails.password}
                                    placeholder="*******"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox checked={isVendor} onCheckedChange={handleCheckBox} id="role" />
                                <label
                                    htmlFor="role"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Register as a Vendor
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                            >
                                {loading ? "Signing up..." : "Singup"}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="underline underline-offset-4">
                                Login here
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
