
import { Spacer } from "@nextui-org/react"
import React from "react"
import TitleDisplay from "./TitleDisplay"

                    interface DataWidgetDisplayProps {
                        className?: string,
                        title: string,
                        value: number,
                        prefix?: string,
                        size?: "sm" | "xl"
                    }
                    
                    
const DataWidgetDisplay = (props: DataWidgetDisplayProps) => 
{
    const _size = props.size ?? "sm"
    return (<div>
        <TitleDisplay title={props.title}/>
        <Spacer y={3}/>
        <div className="font-bold">
            <span className={_size == "sm" ? "text-4xl" : "text-5xl"}> {props.value} </span>
            <span> {props.prefix} </span>
        </div>
    </div>)
}
export default DataWidgetDisplay