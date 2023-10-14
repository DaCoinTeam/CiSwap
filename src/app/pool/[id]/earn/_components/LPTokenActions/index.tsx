"use client"
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { AppButton, DataWidgetDisplay } from "@app/_shared"
import Withdraw from "./Withdraw"
import Deposit from "./Deposit"

interface LPTokenActionsProps {
  className?: string;
}

const LPTokenActions = (props: LPTokenActionsProps) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    return (
        <Card className={`${props.className}`}>
            <CardBody className="flex flex-cols justify-between">
                <DataWidgetDisplay
                    title="Your Balance"
                    value={500}
                    prefix="USDT"
                    size="lg"
                />
                <div className="grid grid-cols-2 gap-4">
                    <Withdraw />
                    <Deposit />
                </div>
            </CardBody>
        </Card>
    )
}

export default LPTokenActions
