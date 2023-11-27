"use client"
import React from "react"
import FormikProviders from "./formik"
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Spacer,
} from "@nextui-org/react"
import { AppButton } from "@app/_shared"
import MainSection from "./MainSection"

interface SwapSectionProps {
  className?: string;
}

const SwapSection = (props: SwapSectionProps) => {
    return (
       
        <Card className={`${props.className}`}>
            <CardHeader className="p-5">
                <span className="font-bold text-lg">Swap</span>
            </CardHeader>
            <Divider />
            <CardBody className="p-5">
                <FormikProviders>
                    <MainSection />
                    <Spacer y={12} />
                    <AppButton
                        className="w-full"
                        content="Swap"
                        typeSubmit
                    />
                </FormikProviders>
            </CardBody>
        </Card>

    )
}

export default SwapSection
