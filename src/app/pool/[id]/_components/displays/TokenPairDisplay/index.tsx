import { PoolContext } from "../../../layout"
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid"
import { Avatar, AvatarGroup, Button, Skeleton } from "@nextui-org/react"
import React, { useContext } from "react"

interface TokenPairDisplayProps {
  className?: string;
  token0ImageUrl?: string;
  token1ImageUrl?: string;
  size?: "sm" | "lg";
  showInverse?: boolean;
}

const TokenPairDisplay = (props: TokenPairDisplayProps) => {
    const context = useContext(PoolContext)
    if (context == null) return 
    const { tokenState } = context

    if (tokenState == null) return

    let _size = props.size
    if (_size == undefined) _size = "sm"

    let _tokenImageClassName: string = ""
    let _textClassName: string = ""
    let _skeletonSize: string = ""

    switch (_size) {
    case "sm":
        _tokenImageClassName = "w-5 h-5"
        _textClassName = "text-sm"
        _skeletonSize = "h-5 w-20"
        break
    case "lg":
        _tokenImageClassName = "w-9 h-9"
        _textClassName = "text-3xl"
        _skeletonSize = "h-9 w-48"
        break
    }

    const _showInverse = () =>
        props.showInverse ? (
            <Button
                isIconOnly
                variant="light"
                className="w-6 h-6 min-w-0 justify-none"
                endContent={<ArrowsRightLeftIcon height={16} width={16} />}
            />
        ) : null

    return (
        <div className={`${props.className}`}>
            {tokenState.finishLoadWithoutConnected ? (
                <div className="flex gap-2 items-center">
                    <AvatarGroup>
                        <Avatar
                            classNames={{
                                base: `${_tokenImageClassName}`,
                            }}
                            showFallback
                            src={props.token0ImageUrl}
                            fallback={<QuestionMarkCircleIcon className={`${_tokenImageClassName}`} />}
                        />
                        <Avatar
                            classNames={{
                                base: `${_tokenImageClassName}`,
                            }}
                            showFallback
                            src={props.token1ImageUrl}
                            fallback={<QuestionMarkCircleIcon className={`${_tokenImageClassName}`} />}
                        />
                    </AvatarGroup>
                    <span className={`font-bold ${_textClassName}`}>
                        {" "}
                        {tokenState.token0Symbol}/{tokenState.token1Symbol}{" "}
                    </span>
                    {_showInverse()}
                </div>
            ) : (
                <Skeleton className={`${_skeletonSize} rounded`}/>
            )}
        </div>
    )
}

export default TokenPairDisplay
