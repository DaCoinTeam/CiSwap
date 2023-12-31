import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid"
import {
    Avatar,
    AvatarGroup,
    Button,
    Skeleton
} from "@nextui-org/react"
import React from "react"
import { Address } from "web3"

interface TokenPairDisplayProps {
  className?: string;
  tokenA: Address;
  tokenB: Address;
  imageUrlA?: string;
  imageUrlB?: string;
  symbolA: string;
  symbolB: string;
  size?: Size;
  isInversed?: boolean;
  finishLoad?: boolean;
}

const TokenPairDisplay = (props: TokenPairDisplayProps) => {
    props.size = props.size ?? "sm"

    const sizeToClassNames: Record<Size, ClassNames> = {
        sm: {
            imageUrl: "w-5 h-5",
            text: "text-sm",
            skeleton: "h-6 w-30",
            button: "h-6 w-6",
            icon: "h-4 h-4",
        },
        lg: {
            imageUrl: "w-9 h-9",
            text: "text-3xl",
            skeleton: "h-9 w-60",
            button: "h-9 w-9",
            icon: "h-6 w-6",
        },
    }

    const classNames = sizeToClassNames[props.size]

    const states = {
        tokenIn: props.isInversed ? props.tokenA : props.tokenB,
        tokenOut: props.isInversed ? props.tokenB : props.tokenA,
        imageUrlIn: props.isInversed ? props.imageUrlA : props.imageUrlB,
        imageUrlOut: props.isInversed ? props.imageUrlB : props.imageUrlA,
        symbolIn: props.isInversed ? props.symbolA : props.symbolB,
        symbolOut: props.isInversed ? props.symbolB : props.symbolA,
    }

    const _inverse = () =>
        props.isInversed ? (
            <Button
                isIconOnly
                variant="light"
                className="w-6 h-6 min-w-0 justify-none"
                endContent={<ArrowsRightLeftIcon height={16} width={16} />}
            />
        ) : null

    const _handleSwitch = () => {}
    return (
        <div className={`${props.className}`}>
            {props.finishLoad ? (
                <div className="flex gap-2 items-center">
                    <div className="flex gap-2 items-center">
                        <AvatarGroup>
                            <Avatar
                                classNames={{
                                    base: `${classNames.imageUrl}`,
                                }}
                                showFallback
                                src={states.imageUrlIn}
                                fallback={
                                    <QuestionMarkCircleIcon className={`${classNames.imageUrl}`} />
                                }
                            />
                            <Avatar
                                classNames={{
                                    base: `${classNames.imageUrl}`,
                                }}
                                showFallback
                                src={states.imageUrlOut}
                                fallback={
                                    <QuestionMarkCircleIcon className={`${classNames.imageUrl}`} />
                                }
                            />
                        </AvatarGroup>

                        <span className={`font-bold ${classNames.text}`}>
                            {" "}
                            {states.symbolIn}/{states.symbolOut}{" "}
                        </span>
                        {_inverse()}
                    </div>
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={_handleSwitch}
                        radius="full"
                        className={`${classNames.button} min-w-0 flex-none`}
                    >
                        <ArrowsRightLeftIcon className={`${classNames.icon}`} />
                    </Button>
                </div>
            ) : (
                <Skeleton className={`${classNames.skeleton} rounded`} />
            )}
        </div>
    )
}

export default TokenPairDisplay

type Size = "sm" | "lg";

interface ClassNames {
  imageUrl: string;
  text: string;
  skeleton: string;
  button: string;
  icon: string;
}
