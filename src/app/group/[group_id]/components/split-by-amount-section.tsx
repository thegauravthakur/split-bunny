import React from "react"
import { LiaRupeeSignSolid } from "react-icons/lia"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SplitByAmountSection() {
    return (
        <div className="grid grid-cols-[1fr_100px] items-center gap-4">
            <Label>You</Label>
            <Input
                required
                className=""
                defaultValue={100}
                placeholder="-"
                startIcon={LiaRupeeSignSolid}
                type="number"
            />
            <Label>Rudra</Label>
            <Input
                required
                className=""
                defaultValue={100}
                placeholder="-"
                startIcon={LiaRupeeSignSolid}
                type="number"
            />
            <Label>Ramesh Kumar</Label>
            <Input
                required
                className=""
                defaultValue={100}
                placeholder="-"
                startIcon={LiaRupeeSignSolid}
                type="number"
            />
        </div>
    )
}
