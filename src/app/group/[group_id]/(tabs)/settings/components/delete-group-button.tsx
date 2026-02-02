"use client"

import { useState } from "react"
import { CgSpinner } from "react-icons/cg"
import { toast } from "sonner"

import { deleteGroupAction } from "@/app/group/[group_id]/action"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface DeleteGroupButtonProps {
    groupId: string
    groupName: string
    isSettled: boolean
}

export function DeleteGroupButton({ groupId, groupName, isSettled }: DeleteGroupButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleDelete() {
        try {
            setIsDeleting(true)
            const result = await deleteGroupAction(groupId)

            if ("error" in result) {
                const errors = result.error as string[]
                toast.error(errors[0] ?? "Failed to delete group")
                setIsDeleting(false)
                setOpen(false)
                return
            }

            toast.success("Group deleted successfully")
            // Redirect happens in the server action
        } catch {
            toast.error("Failed to delete group")
            setIsDeleting(false)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full"
                    disabled={!isSettled}
                    variant="destructive"
                >
                    Delete Group
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete &quot;{groupName}&quot;?</DialogTitle>
                    <DialogDescription className="pt-2 space-y-2">
                        <span className="block">
                            This action cannot be undone. This will permanently delete:
                        </span>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>The group and all its settings</li>
                            <li>All expenses and their split history</li>
                            <li>All pending invitations</li>
                        </ul>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button disabled={isDeleting} variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        disabled={isDeleting}
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        {isDeleting ? (
                            <>
                                <CgSpinner className="animate-spin mr-2" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Group"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
