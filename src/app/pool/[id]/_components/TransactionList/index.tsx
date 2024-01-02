"use client"
import { Card, CardBody } from "@nextui-org/react"
import React from "react"
import TransactionTable from "./TransactionTable"
import { TitleDisplay } from "@app/_shared"

interface TransactionListProps {
  className?: string;
}

const TransactionList = (props: TransactionListProps) => {

    return (
        <Card className={`${props.className}`}>
            <CardBody className="p-5">
                <div className="flex flex-col gap-4">
                    <TitleDisplay text="Transactions" size="lg" />
                    <TransactionTable />
                </div>      
            </CardBody>
        </Card>
    )
}

export default TransactionList
