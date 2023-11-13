"use client"
import { Card, CardBody } from "@nextui-org/react"
import React, { useContext } from "react"
import { TokenStateContext } from "@app/pool/[id]/layout"
import TransactionTable from "./TransactionTable"
import { TitleDisplay } from "@app/_shared"

interface TransactionListProps {
  className?: string;
}

const TransactionList = (props: TransactionListProps) => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    return (
        <Card className={`${props.className}`}>
            <CardBody>
                <div className="flex flex-col gap-4">
                    <TitleDisplay title="Transactions" size="lg" />
                    <TransactionTable />
                </div>      
            </CardBody>
        </Card>
    )
}

export default TransactionList
