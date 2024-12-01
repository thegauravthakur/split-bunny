import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { FaAndroid } from "react-icons/fa"
import { IoSettings } from "react-icons/io5"
import { MdLogout } from "react-icons/md"
import { MdOutlineCallSplit } from "react-icons/md"
import { TiGroup } from "react-icons/ti"

import { LogoutButton } from "@/app/components/logout-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export async function Header() {
    const user = await currentUser()
    const name = user?.fullName?.split(" ")
    const initials = name?.map((name) => name[0]).join("")

    return (
        <header className="flex items-center justify-between border-b px-2 md:px-4 text-sm h-12 md:h-14 shadow-sm">
            <h1 className="font-bold text-base md:text-lg flex items-center gap-2">
                <MdOutlineCallSplit className="size-5 md:size-6" />
                <Link href={"/"}>Split Bunny</Link>
            </h1>
            {user ? (
                <div className="flex gap-x-4">
                    <Popover>
                        <PopoverTrigger>
                            <Avatar className="size-7 md:size-8">
                                <AvatarImage alt={user?.fullName ?? ""} src={user?.imageUrl} />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent className="flex flex-col rounded-xl py-2 px-1 w-64">
                            <Button
                                className="justify-start [&_svg]:size-5 gap-2.5"
                                variant="ghost"
                            >
                                <TiGroup className="" />
                                <span>Groups</span>
                            </Button>
                            <Button
                                className="justify-start [&_svg]:size-5 gap-2.5"
                                variant="ghost"
                            >
                                <IoSettings className="size-5" />
                                <span>Settings</span>
                            </Button>
                            <Button
                                className="justify-start [&_svg]:size-5 gap-2.5"
                                variant="ghost"
                            >
                                <FaAndroid className="size-5" />
                                <span>Download the app</span>
                            </Button>
                            <LogoutButton
                                className="justify-start [&_svg]:size-5 gap-2.5"
                                variant="ghost"
                            >
                                <MdLogout className="size-5" />
                                <span>Logout</span>
                            </LogoutButton>
                        </PopoverContent>
                    </Popover>
                </div>
            ) : null}
        </header>
    )
}
