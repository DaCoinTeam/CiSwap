import React from "react"
import { Tab, Tabs } from "@nextui-org/react"
import { Period } from "@services"
import { useSelector } from "react-redux"
import { RootState } from "@redux"

interface PeriodTabsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  tab: Period;
  setTab: React.Dispatch<React.SetStateAction<Period>>;
}

const periods = [
    {
        key: Period._24H,
        value: "24H",
    },
    {
        key: Period._1W,
        value: "1W",
    },
    {
        key: Period._1M,
        value: "1M",
    },
    {
        key: Period._1Y,
        value: "1Y",
    },
]

const PeriodTabs = (props: PeriodTabsProps) => {
    const darkMode = useSelector((state: RootState) => state.configuration.darkMode)

    const selected = darkMode
        ? "group-data-[selected=true]:text-black"
        : "group-data-[selected=true]:text-white"
    
    const onChangeSelection = (key: React.Key) => {
        const _key = key.toString()
        props.setTab(_key as Period)
    }

    return (
        <Tabs
            className={`${props.className}`}
            size={props.size}
            radius="sm"
            aria-label="Tabs variants"
            classNames={{
                tabContent: `font-bold ${selected}`,
            }}
            color={"primary"}
            selectedKey={props.tab}
            onSelectionChange={onChangeSelection}
        >
            {periods.map((period) => (
                <Tab key={period.key} title={period.value} />
            ))}
        </Tabs>
    )
}

export default PeriodTabs
