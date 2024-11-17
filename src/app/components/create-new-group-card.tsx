import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog"
import { ClientForm, ClientFormButton } from "@/components/helpers/client-form"
import { createGroupAction } from "@/app/action"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Create a new group</DialogTitle>
                    <DialogDescription>
                        Create a new group and start splitting bills
                    </DialogDescription>
                </DialogHeader>
                <DialogBody className="mt-2">
                    <ClientForm action={createGroupAction} className="flex flex-col gap-y-4">
                        <Label htmlFor="group-name">Group name</Label>
                        <Input
                            required
                            type="text"
                            id="group-name"
                            placeholder="Flatmates"
                            name="name"
                        />
                        <ClientFormButton className="mt-6">Create Group</ClientFormButton>
                    </ClientForm>
                </DialogBody>
            </DialogContent>
        </Dialog>
    )
}
