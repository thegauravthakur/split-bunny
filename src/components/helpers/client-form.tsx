"use client"
import { HTMLProps } from "react"
import { toast } from "sonner"
import { GenericFormActionResponse } from "@/app/(auth)/sign-in/action"

interface ClientFormProps extends Omit<HTMLProps<HTMLFormElement>, "action"> {
    action: (formData: FormData) => Promise<GenericFormActionResponse>
}

export function ClientForm(props: ClientFormProps) {
    return (
        <form
            {...props}
            action={async (formData) => {
                const response = await props.action(formData)
                if (response.errors) {
                    response.errors.forEach((error) => toast.error(error))
                }
            }}
        />
    )
}
