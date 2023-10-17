import { Spacer } from "@nextui-org/react"
import React from "react"
import TitleDisplay from "./TitleDisplay"

interface DataWidgetDisplayProps {
  className?: string;
  title: string;
  value: number;
  prefix?: string;
  size?: "sm" | "md" | "lg";
}

const DataWidgetDisplay = (props: DataWidgetDisplayProps) => {
    let _y: 1 | 2 | 3 | undefined
    let _size: "text-2xl" | "text-3xl" | "text-4xl"
    switch (props.size) {
    case undefined:
    case "md":
        _y = 2
        _size = "text-3xl"
        break
    case "sm":
        _y = 1
        _size = "text-2xl"
        break
    case "lg":
        _y = 3
        _size = "text-4xl"
        break
    }
    return (
        <div className={`${props.className}`}>
            <TitleDisplay title={props.title} />
            <Spacer y={_y} />
            <div className="font-bold">
                <span className={_size}> {props.value} </span>
                <span> {props.prefix} </span>
            </div>
        </div>
    )
}
export default DataWidgetDisplay
