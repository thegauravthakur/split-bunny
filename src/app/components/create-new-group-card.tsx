import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog"

import { createGroupAction } from "@/app/action"
import { ClientForm, ClientFormButton } from "@/components/helpers/client-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateNewGroupCard() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="border rounded-md shadow p-4 flex flex-col justify-between gap-y-4">
                    <span className="capitalize">new group</span>
                    <span className="text-sm text-muted-foreground">
                        create a new group and start splitting bills
                    </span>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new group</DialogTitle>
                    <DialogDescription>
                        Create a new group and start splitting bills
                    </DialogDescription>
                </DialogHeader>
                <DialogBody className="mt-2">
                    <ClientForm action={createGroupAction} className="flex flex-col gap-y-4">
                        <Label htmlFor="name">Group name</Label>
                        <Input required id="name" name="name" placeholder="Family" type="text" />
                        <ClientFormButton className="mt-6">Create Group</ClientFormButton>
                    </ClientForm>
                </DialogBody>
            </DialogContent>
        </Dialog>
    )
}
