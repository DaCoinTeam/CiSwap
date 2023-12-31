import { Skeleton, Spacer } from "@nextui-org/react"
import React from "react"
import TitleDisplay from "./TitleDisplay"

interface DataDisplayProps {
  className?: string;
  title: string;
  value: number;
  prefix?: string;
  size?: "sm" | "md" | "lg";
  finishLoad?: boolean
}

const DataDisplay = (props: DataDisplayProps) => {
    let _skeletonHeight : "h-8" | "h-9" | "h-10" | undefined

    let _size: "text-2xl" | "text-3xl" | "text-4xl"
    switch (props.size) {
    case undefined:
    case "md":
        _size = "text-3xl"
        _skeletonHeight = "h-9"
        break
    case "sm":
        _size = "text-2xl"
        _skeletonHeight = "h-8"
        break
    case "lg":
        _size = "text-4xl"
        _skeletonHeight = "h-10"
        break
    }

    return (
        <div className={`${props.className}`}>
            <TitleDisplay title={props.title} />
            <Spacer y={1} />
            {props.finishLoad 
                ?
                <>
                    <div className="font-bold">
                        <span className={_size}> {props.value} </span>
                        <span> {props.prefix} </span>
                    </div>
                </>
                : <Skeleton className={`${_skeletonHeight} w-40 rounded`}/>
            }
        </div>
    )
}
export default DataDisplay
