import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { Skeleton, Image } from "@nextui-org/react"
import React from "react"

interface TokenDisplayProps {
  className?: string;
  tokenSymbol: string;
  tokenImageUrl?: string;
  finishLoad?: boolean;
}

const TokenDisplay = (props: TokenDisplayProps) => {
    const _renderImage = () => {
        if (props.tokenImageUrl){
            return  <Image
                className="w-4 h-4"
                radius="full"
                src={props.tokenImageUrl}
            />
        }
        return <QuestionMarkCircleIcon className="w-4 h-4"/>
    }
    return (
        <>
            {props.finishLoad ? (
                <div className={`flex gap-1 items-center ${props.className}`}>
                    {_renderImage()}
                    <span className="text-xs font-bold">{props.tokenSymbol}</span>
                </div>
            ) : (
                <Skeleton className="h-4 w-12 rounded" />
            )}
        </>
    )
}

export default TokenDisplay
