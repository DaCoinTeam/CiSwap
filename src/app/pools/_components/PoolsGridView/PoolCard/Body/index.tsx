"use client"
import { TitleDisplay } from "@app/_shared"
import { Avatar, AvatarGroup, Card, CardBody, Chip } from "@nextui-org/react"
import React, { useContext } from "react"
import { PoolCardContext } from "../index"

interface BodyProps {}

const Body = (props: BodyProps) => {
    const { balance0, balance1 } = useContext(PoolCardContext)!
    return (
        <CardBody className="p-5">
            <div className="flex gap-6">
                <div className="flex gap-2">
                    <Avatar fallback className="w-6 h-6"/>
                    {balance0}
                </div>
                <div className="flex gap-2">
                    <Avatar fallback className="w-6 h-6"/>
                    {balance1}
                </div>
            </div>
        </CardBody>
    )
}

export default Body
