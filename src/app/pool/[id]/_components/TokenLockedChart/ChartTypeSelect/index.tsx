import React, { ChangeEvent, useContext } from "react"
import { Select, SelectItem } from "@nextui-org/react"
import { ChartTypeContext } from "../index"

export enum ChartType {
  Liquidity = "Liquidity",
  Volume24H = "Volume 24H",
  TotalTokenLocked = "TotalTokenLocked"
}

interface ChartTypeSelectProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const _types = [
    {
        key: ChartType.Liquidity,
        value: "Liquidity",
    },
    {
        key: ChartType.Volume24H,
        value: "Volume 24H",
    },
    {
        key: ChartType.TotalTokenLocked,
        value: "Total Token Locked",
    }
]

const ChartTypeSelect = (props: ChartTypeSelectProps) => {
    const chartTypeContext = useContext(ChartTypeContext)
    if (chartTypeContext === null) return
    const { chartType, setChartType } = chartTypeContext

    const _size = props.size ?? "md"

    const _handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const _key = event.target.value
        setChartType(_key as ChartType)
    }

    return (
        <Select
            aria-label="Chart Type"
            className={`${_size} max-w-[200px]`}
            items={_types}
            size="sm"
            radius="sm"
            labelPlacement="outside"
            selectedKeys={[chartType]}
            onChange={_handleChange}
        >
            {(_type) => <SelectItem key={_type.key}>{_type.value}</SelectItem>}
        </Select>
    )
}

export default ChartTypeSelect
