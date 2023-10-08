"use client"
import React from "react"
import { Divider } from "@nextui-org/react"
import { SwitchModeButton } from "./SwitchModeButton"
export const Footer = () => {
    return (
        <div className="bg-black-500">
            <div className="max-w-[1024px] mx-auto px-6">
                <Divider />
                <div className="flex justify-between my-6">
                    <SwitchModeButton />
                32
                </div>
            </div>
        </div>
    )
}
