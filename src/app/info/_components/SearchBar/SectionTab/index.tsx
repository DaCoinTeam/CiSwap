"use client"
import { Tab, Tabs } from "@nextui-org/react"
import React from "react"

const SectionTab = () => {
    return (
        <Tabs items={options}>
            {option => (
                <Tab key={option.key} content={option.label} />
            )}
        </Tabs>
    )
}

export default SectionTab

const options = [
    {
        key: 0,
        label: "Overview",
    },
    {
        key: 1,
        label: "Pairs",
    },
    {
        key: 2,
        label: "Tokens",
    }
]