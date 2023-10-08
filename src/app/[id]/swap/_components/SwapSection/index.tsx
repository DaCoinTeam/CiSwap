"use client"
import React from "react"
import FormikProviders from "./formik"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Spacer,
} from "@nextui-org/react"
import TokenInput from "./TokenInput"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import { AppButton } from "@app/_shared"
import { RootState } from "@redux"
import { useSelector } from "react-redux"

interface SwapSectionProps {
  className?: string;
}

const SwapSection = (props: SwapSectionProps) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    return (
        <FormikProviders>
            <Card className={`${props.className}`}>
                <CardHeader className="p-5">
                    {" "}
                    <span className="text-xl font-bold">Swap</span>
                </CardHeader>
                <Divider />
                <CardBody className="grid justify-items-center">
                    <TokenInput />
                    <Spacer y={6} />
                    <Button
                        isIconOnly
                        endContent={<ArrowsUpDownIcon height={24} width={24} />}
                        radius="full"
                    />
                    <Spacer y={6} />
                    <TokenInput />
                    <Spacer y={12} />
                    <AppButton
                        className="w-full"
                        size="lg"
                        content="Swap"
                        darkMode={darkMode}
                    />
                </CardBody>
            </Card>
        </FormikProviders>
    )
}

export default SwapSection
