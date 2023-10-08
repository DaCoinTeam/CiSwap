import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid"
import { Avatar, AvatarGroup, Button, Skeleton } from "@nextui-org/react"
import React from "react"

interface TokenPriceRatioDisplayProps {
  className?: string;
  token0Symbol: string;
  token1Symbol: string;
  token0ImageUrl?: string;
  token1ImageUrl?: string;
  token0BasePrice?: number;
  token0Price: number;
  finishLoad?: boolean;
}

const TokenPairDisplay = (props: TokenPriceRatioDisplayProps) => {
    return (
        <>
            {!props.finishLoad ? (
                <div className="flex gap-2 items-center">
                    <AvatarGroup>
                        <Avatar
                            classNames={{
                                base: "w-5 h-5",
                            }}
                            src={props.token0ImageUrl ?? "/images/QuestionMarkCircle.svg"}
                        />
                        <Avatar
                            classNames={{
                                base: "w-5 h-5",
                            }}
                            src={props.token1ImageUrl ?? "/images/QuestionMarkCircle.svg"}
                        />
                    </AvatarGroup>
                    <span className="font-bold text-sm">
                        {" "}
                        {props.token0Symbol}/{props.token1Symbol}{" "}
                    </span>
                    <Button isIconOnly variant="light" className="w-6 h-6 min-w-0 justify-none" endContent={<ArrowsRightLeftIcon height={16} width={16}/>}/>

                </div>
            ) : (
                <Skeleton className="h-5 w-12 rounded" />
            )}
        </>
    )
}

export default TokenPairDisplay
