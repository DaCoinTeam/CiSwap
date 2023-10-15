import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { Skeleton, Avatar } from "@nextui-org/react"
import React from "react"

interface TokenDisplayProps {
  className?: string;
  tokenSymbol: string;
  tokenImageUrl?: string;
  finishLoad?: boolean;
}

const TokenDisplay = (props: TokenDisplayProps) => {
    return (
        <>
            {props.finishLoad ? (
                <div className={`flex gap-1 items-center ${props.className}`}>
                    <Avatar
                        className="w-4 h-4"
                        radius="full"
                        showFallback
                        src={props.tokenImageUrl}
                        fallback={
                            <QuestionMarkCircleIcon className="w-4 h-4"/>
                        }
                    />
                    <span className="text-xs font-bold">{props.tokenSymbol}</span>
                </div>
            ) : (
                <Skeleton className="h-4 w-12 rounded" />
            )}
        </>
    )
}

export default TokenDisplay
