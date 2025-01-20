import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { CircleAlert } from "lucide-react"

export interface AlertProps {
    title?: string
    description: string
}


export function ErrorAlert({ title, description }: AlertProps) {
    return (
        <Alert variant={"destructive"} className="flex items-center gap-2">
            <CircleAlert className="h-4 w-4" />
            <div className="flex flex-col justify-center">
                {title && <AlertTitle>{title}</AlertTitle>}
                <AlertDescription>
                    {description}
                </AlertDescription>
            </div>

        </Alert>
    )
}