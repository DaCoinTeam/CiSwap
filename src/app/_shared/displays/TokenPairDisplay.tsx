import { TokenStateContext } from "@app/pool/[id]/layout"
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid"
import { Avatar, AvatarGroup, Button, Skeleton } from "@nextui-org/react"
import React, { useContext } from "react"

interface TokenPairDisplayProps {
  className?: string;
  token0ImageUrl?: string;
  token1ImageUrl?: string;
}

const TokenPairDisplay = (props: TokenPairDisplayProps) => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    return (
        <div className={`${props.className}`}>
            {tokenState.finishLoadWithoutConnected ? (
                <div className="flex gap-2 items-center">
                    <AvatarGroup>
                        <Avatar
                            classNames={{
                                base: "w-5 h-5",
                            }}
                            showFallback
                            src={props.token0ImageUrl}
                            fallback={<QuestionMarkCircleIcon className="w-5 h-5"/>}
                        />
                        <Avatar
                            classNames={{
                                base: "w-5 h-5",
                            }}
                            showFallback
                            src={props.token1ImageUrl}
                            fallback={<QuestionMarkCircleIcon className="w-5 h-5"/>}
                        />
                    </AvatarGroup>
                    <span className="font-bold text-sm">
                        {" "}
                        {tokenState.token0Symbol}/{tokenState.token1Symbol}{" "}
                    </span>
                    <Button isIconOnly variant="light" className="w-6 h-6 min-w-0 justify-none" endContent={<ArrowsRightLeftIcon height={16} width={16}/>}/>

                </div>
            ) : (
                <Skeleton className="h-6 w-24 rounded" />
            )}
        </div>
    )
}

export default TokenPairDisplay
