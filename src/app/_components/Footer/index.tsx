"use client"
import React from "react"
import { Divider } from "@nextui-org/react"
import SwitchModeButton from "./SwitchModeButton"
const Footer = () => {
    return (
        <footer>
            <div className="max-w-[1024px] m-auto">
                <Divider />
                <div className="flex justify-between my-6">
                    <SwitchModeButton />
                32
                </div>
            </div>
        </footer>
    )
}

export default Footer
