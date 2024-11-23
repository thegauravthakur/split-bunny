"use client"
import { HTMLProps } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { PiSpinner } from "react-icons/pi"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import { Result } from "neverthrow"
import { parseResultInterfaceFromObject } from "@/app/utils/result"
import Form from "next/form"

interface ClientFormProps extends Omit<HTMLProps<HTMLFormElement>, "action"> {
    action: (formData: FormData) => any
    onSubmitSuccess?: () => void
    closeOnSuccess?: boolean
}

function handleGenericResponse<T, K>(response: Result<T, K>) {
    const handleMessage = (message: unknown, isSuccess: boolean) => {
        if (isSuccess && typeof message === "string") toast.success(message)
        else if (typeof message === "string") toast.error(message)
    }

    const handleResponse = (messages: unknown, isSuccess: boolean) => {
        if (!Array.isArray(messages)) return
        if (isSuccess) messages.forEach((message) => handleMessage(message, true))
        else messages.forEach((message) => handleMessage(message, false))
    }

    response
        .map((messages) => handleResponse(messages, true))
        .mapErr((messages) => handleResponse(messages, false))
}

export function ClientForm<T, K>({ onSubmitSuccess, ...props }: ClientFormProps) {
    return (
        <Form
            {...props}
            action={async (formData) => {
                const _response = await props.action(formData)
                console.log(_response)
                const response = parseResultInterfaceFromObject<T, K>(_response)
                console.log(response)
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
            {isLoading && <PiSpinner className="animate-spin" fontSize={18} />}
            <span>{children}</span>
        </Button>
    )
}
