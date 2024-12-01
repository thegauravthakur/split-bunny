import { createGroupAction } from "@/app/action"
import { DialogBottomSheet } from "@/app/components/dialog-bottom-sheet"
import { PlainCard } from "@/app/components/plain-cart"
import { ClientForm, ClientFormButton } from "@/components/helpers/client-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateNewGroupCard() {
    return (
        <DialogBottomSheet
            modal
            body={
                <ClientForm action={createGroupAction} className="flex flex-col gap-y-4">
                    <Label htmlFor="name">Group name</Label>
                    <Input required id="name" name="name" placeholder="Family" type="text" />
                    <ClientFormButton className="mt-6">Create Group</ClientFormButton>
                </ClientForm>
            }
            description="Create a new group and start splitting bills"
            title="Create a new group"
            trigger={
                <Button
                    className="bg-transparent h-full w-full p-0 hover:bg-transparent items-start border border-primary"
                    variant="ghost"
                >
                    <PlainCard
                        description="create a new group and start splitting bills"
                        title="new group"
                    />
                </Button>
            }
        />
    )
}
