import { DialogBottomSheet } from "@/app/components/dialog-bottom-sheet"
import { addNewMember } from "@/app/group/[group_id]/(tabs)/members/actions"
import { getDevice } from "@/app/utils/device/device.server"
import { ClientForm, ClientFormButton } from "@/components/helpers/client-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddNewMemberCardProps {
    groupId: string
}

export async function AddNewMemberCard({ groupId }: AddNewMemberCardProps) {
    const device = await getDevice()
    return (
        <DialogBottomSheet
            modal
            body={
                <ClientForm closeOnSuccess action={addNewMember} className="flex flex-col gap-y-4">
                    <Label htmlFor="name">Member name</Label>
                    <Input required id="name" name="name" placeholder="Rohan" type="text" />
                    <Label htmlFor="email">Member Email</Label>
                    <Input
                        required
                        id="email"
                        name="email"
                        placeholder="rohan@gmail.com"
                        type="email"
                    />
                    <input type="hidden" name="group_id" value={groupId} />
                    <ClientFormButton className="mt-6">Add New Member</ClientFormButton>
                </ClientForm>
            }
            description="Add a new member to the group"
            device={device}
            title="Add a new member"
            trigger={
                <button className="border shadow-xs p-3 rounded-lg border-primary text-left w-full">
                    <div className="h-12 flex flex-col">
                        <span className="font-semibold">Add New Member</span>
                        <span className="text-muted-foreground text-sm">
                            Add a new member to the group
                        </span>
                    </div>
                </button>
            }
        />
    )
}
