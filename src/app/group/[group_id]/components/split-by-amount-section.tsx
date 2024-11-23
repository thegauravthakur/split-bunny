import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LiaRupeeSignSolid } from "react-icons/lia"
import React from "react"

export function SplitByAmountSection() {
    return (
        <div className="grid grid-cols-[1fr_100px] items-center gap-4">
            <Label>You</Label>
            <Input
                startIcon={LiaRupeeSignSolid}
                className=""
                required
                type="number"
                placeholder="-"
                defaultValue={100}
            />
            <Label>Rudra</Label>
            <Input
                startIcon={LiaRupeeSignSolid}
                className=""
                required
                type="number"
                placeholder="-"
                defaultValue={100}
            />
            <Label>Ramesh Kumar</Label>
            <Input
                startIcon={LiaRupeeSignSolid}
                className=""
                required
                type="number"
                placeholder="-"
                defaultValue={100}
            />
        </div>
    )
}
