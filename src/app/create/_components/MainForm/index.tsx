"use client"
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import React from "react"
import SelectToken from "./SelectToken"

const MainForm = () => {
    return (
        <Card>
            <CardHeader className="p-5">
                <div className="font-bold text-lg">Create Liquidity Pool</div>
            </CardHeader>
            <Divider />
            <CardBody>
                <SelectToken />
            </CardBody>
        </Card>
    )
}

export default MainForm
