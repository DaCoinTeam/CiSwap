"use client"
import React from "react"
import { Card, CardBody, CardHeader, Divider, Spacer } from "@nextui-org/react"
import { AppButton } from "@app/_shared"
import MainSection from "./MainSection"
import Options from "./Options"

interface SwapSectionProps {
  className?: string;
}

const SwapSection = (props: SwapSectionProps) => {
    return (
        <Card className={`${props.className}`}>
            <CardHeader className="p-5">
                <div className="flex flex-col gap-6">
                    <div className="font-bold text-lg">Swap</div>
                    <Options />
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-5">
                <MainSection />
                <Spacer y={12} />
                <AppButton className="w-full" text="Swap" submit />
            </CardBody>
        </Card>
    )
}

export default SwapSection
