import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { Skeleton, Tooltip } from "@nextui-org/react"
import React from "react"

interface TokenTooltipProps {
    className?: string,
    value: number,
    prefix: string,
    tooltipContent: string,
    finishLoad?: boolean
}

const TokenTooltip = (props : TokenTooltipProps) => 
    <div className={`${props.className}`}>
        {props.finishLoad ?
            <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">
                    {props.value}
                </span>

                <div className="gap-2 flex items-center">
                    <div>
                        {props.prefix}
                    </div>
                    <Tooltip showArrow={true} content={props.tooltipContent}>
                        <QuestionMarkCircleIcon height={16} width={16} />
                    </Tooltip>
                </div>
            </div> : <Skeleton className="h-10 w-48 rounded"/>}
    </div>
export default TokenTooltip