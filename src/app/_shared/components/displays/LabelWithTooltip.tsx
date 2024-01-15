import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import React from "react"
import { Tooltip } from "@nextui-org/react"
interface LabelWithTooltipProps {
  className?: string;
  text: string;
  tooltipContent: string;
}

const LabelWithTooltip = (props: LabelWithTooltipProps) => {
    return (
        <div className={`${props.className} gap-1 flex items-center`}>
            <div className="text-sm">{props.text} </div>
            <Tooltip showArrow content={props.tooltipContent}>
                <QuestionMarkCircleIcon className="w-3.5 h-3.5"/>
            </Tooltip>
        </div>
    )
}
export default LabelWithTooltip
