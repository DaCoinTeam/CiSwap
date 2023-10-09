import React from "react"
import {Tab, Tabs } from "@nextui-org/react"
import { ChartTimePeriod } from "@definitions"

interface PeriodTabsProps {
  className?: string;
  darkMode?: boolean;
  size?: "sm" | "md" | "lg";

}

const _periods = [
    {
        key: 0,
        value: ChartTimePeriod._24H,
    },
    {
        key: 1,
        value: ChartTimePeriod._1W,
    },
    {
        key: 2,
        value: ChartTimePeriod._1M,
    },
    {
        key: 3,
        value: ChartTimePeriod._1Y,
    },
]

const PeriodTabs = (props: PeriodTabsProps) => {
    const _size = props.size ?? "md"
    return (
        <Tabs
            className={`${props.className}`}
            size={_size}
            aria-label="Tabs variants"
            classNames={{
                cursor: "!bg-teal-500",
                tabContent: `font-bold group-data-[selected=true]:text-${props.darkMode?"black":"white"}`,
            }}
        >
            {_periods.map((_period) => (
                <Tab key={_period.key} title={_period.value} />
            ))}
        </Tabs>
    )
}

export default PeriodTabs
