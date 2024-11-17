"use client"
import { HTMLProps } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { PiSpinner } from "react-icons/pi"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import { Result, safeTry } from "neverthrow"
import { parseServerStringToResultInterface } from "@/app/utils/result"

interface ClientFormProps extends Omit<HTMLProps<HTMLFormElement>, "action"> {
    action: (formData: FormData) => Promise<string>
    onSubmitSuccess?: () => void
}

function handleGenericResponse(response: Result<string[], string[]>) {
    response
        .map((messages) => messages.forEach((message) => toast.success(message)))
        .mapErr((messages) => messages.forEach((message) => toast.error(message)))
}

export function ClientForm({ onSubmitSuccess, ...props }: ClientFormProps) {
    return (
        <form
            {...props}
            action={async (formData) => {
                const responseString = await props.action(formData)
                const response = parseServerStringToResultInterface(responseString)
                handleGenericResponse(response)
                if (response.isOk()) {
                    if (onSubmitSuccess) onSubmitSuccess()
                }
            }}
        />
    )
}

interface ClientFormButtonProps extends ButtonProps {
    isLoading?: boolean
}

export function ClientFormButton({
    isLoading: _isLoading,
    disabled,
    children,
    ...props
}: ClientFormButtonProps) {
    const formState = useFormStatus()
    const isLoading = Boolean(formState.pending || _isLoading)

    return (
        <Button
            {...props}
            className={cn(props?.className, "flex items-center gap-2")}
            disabled={disabled || isLoading}
            type="submit"
        >
            {isLoading && <PiSpinner fontSize={18} />}
            <span>{children}</span>
        </Button>
    )
}
