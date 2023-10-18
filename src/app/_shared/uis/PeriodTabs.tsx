import React from "react"
import { Tab, Tabs } from "@nextui-org/react"
import { ChartTimePeriod } from "@utils"
import { useSelector } from "react-redux"
import { RootState } from "@redux"

interface PeriodTabsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  tab: ChartTimePeriod;
  setTab: React.Dispatch<React.SetStateAction<ChartTimePeriod>>;
}

const _periods = [
    {
        key: ChartTimePeriod._24H,
        value: "24H",
    },
    {
        key: ChartTimePeriod._1W,
        value: "1W",
    },
    {
        key: ChartTimePeriod._1M,
        value: "1M",
    },
    {
        key: ChartTimePeriod._1Y,
        value: "1Y",
    },
]

const PeriodTabs = (props: PeriodTabsProps) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    const _size = props.size ?? "md"
    const _selected = darkMode
        ? "group-data-[selected=true]:text-black"
        : "group-data-[selected=true]:text-white"
    
    const _selectionChange = (key: React.Key) => {
        const _key = key.toString()
        props.setTab(_key as ChartTimePeriod)
    }

    return (
        <Tabs
            className={`${props.className}`}
            size={_size}
            aria-label="Tabs variants"
            classNames={{
                cursor: "!bg-teal-500",
                tabContent: `font-bold ${_selected}`,
            }}
            selectedKey={props.tab}
            onSelectionChange={_selectionChange}
        >
            {_periods.map((_period) => (
                <Tab key={_period.key} title={_period.value} />
            ))}
        </Tabs>
    )
}

export default PeriodTabs
