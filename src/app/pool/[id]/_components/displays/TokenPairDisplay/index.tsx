import { PoolContext } from "../../../_hooks"
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
    const poolContext = useContext(PoolContext)
    if (poolContext == null) return
    const { tokenState, isToken0PriceState } = poolContext
    const { isToken0Price, setIsToken0Price } = isToken0PriceState

    const firstTokenSymbol = isToken0Price ? tokenState.token0Symbol : tokenState.token1Symbol 
    const secondTokenSymbol = isToken0Price ? tokenState.token1Symbol : tokenState.token0Symbol 

    if (tokenState == null) return

    let _size = props.size
    if (_size == undefined) _size = "sm"

    let _imageUrlClassName = ""
    let _textClassName = ""
    let _skeletonSize = ""
    let _buttonSize = ""
    let _iconSize = ""

    switch (_size) {
    case "sm":
        _imageUrlClassName = "w-5 h-5"
        _textClassName = "text-sm"
        _skeletonSize = "h-6 w-30"
        _buttonSize = "h-6 w-6"
        _iconSize = "h-4 h-4"
        break
    case "lg":
        _imageUrlClassName = "w-9 h-9"
        _textClassName = "text-3xl"
        _skeletonSize = "h-9 w-60"
        _buttonSize = "h-9 w-9"
        _iconSize = "h-6 w-6"
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

    const _handleSwitch = () => setIsToken0Price(!isToken0Price)
    return (
        <div className={`${props.className}`}>
            {tokenState.finishLoadWithoutConnected ? (
                <div className="flex gap-2 items-center">
                    <div className="flex gap-2 items-center">
                        <AvatarGroup>
                            <Avatar
                                classNames={{
                                    base: `${_imageUrlClassName}`,
                                }}
                                showFallback
                                src={props.token0ImageUrl}
                                fallback={
                                    <QuestionMarkCircleIcon
                                        className={`${_imageUrlClassName}`}
                                    />
                                }
                            />
                            <Avatar
                                classNames={{
                                    base: `${_imageUrlClassName}`,
                                }}
                                showFallback
                                src={props.token1ImageUrl}
                                fallback={
                                    <QuestionMarkCircleIcon
                                        className={`${_imageUrlClassName}`}
                                    />
                                }
                            />
                        </AvatarGroup>

                        <span className={`font-bold ${_textClassName}`}>
                            {" "}
                            {firstTokenSymbol}/{secondTokenSymbol}{" "}
                        </span>
                        {_showInverse()}
                    </div>
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={_handleSwitch}
                        radius="full"
                        className={`${_buttonSize} min-w-0 flex-none`}
                    >
                        <ArrowsRightLeftIcon className={`${_iconSize}`} />
                    </Button>
                </div>
            ) : (
                <Skeleton className={`${_skeletonSize} rounded`} />
            )}
        </div>
    )
}

export default TokenPairDisplay
