"use client"
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import DataWidgetDisplay from "@app/_shared/displays/DataWidgetDisplay"

interface LPTokenActionsProps {
  className?: string;
}

const LPTokenActions = (props: LPTokenActionsProps) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    return (
        <Card className={`${props.className}`}>
            <CardHeader className="p-5">
                <div>
                    <DataWidgetDisplay
                        title="Your Balance"
                        value={500}
                        prefix="USDT"
                        size="lg"
                    />
                </div>
            </CardHeader>
            <Divider />
            <CardBody></CardBody>
        </Card>
    )
}

export default LPTokenActions
