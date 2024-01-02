import React from "react"
import { Tooltip } from "@nextui-org/react"
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"

interface TitleDisplayProps {
  className?: string;
  text: string;
  tooltipText?: string;
}

const TitleDisplay = (props: TitleDisplayProps) => {
    return (
        <div className={`flex gap-1 items-center ${props.className}`}>
            <div className={`text-teal-500 font-bold ${props.className}`}>
                {" "}
                {props.text}{" "}
            </div>
            {props.tooltipText ? (
                <Tooltip showArrow content={props.tooltipText}>
                    <QuestionMarkCircleIcon className="w-4 h-4 text-teal-500" strokeWidth={2.5} />
                </Tooltip>
            ) : null}
        </div>
    )
}
export default TitleDisplay
