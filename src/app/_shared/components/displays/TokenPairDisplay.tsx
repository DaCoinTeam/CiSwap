import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid"
import { Avatar, AvatarGroup, Button, Skeleton } from "@nextui-org/react"
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
  type?: Type;
  finishLoad?: boolean;
  onClick?: () => void;
}

const TokenPairDisplay = (props: TokenPairDisplayProps) => {
    const type : Type = props.type ?? 0

    const typeToClassNames: Record<Type, ClassNames> = {
        0: {
            imageUrl: "w-5 h-5",
            text: "text-sm",
            skeleton: "h-6 w-30",
            button: "h-6 w-6",
            icon: "h-4 h-4",
        },
        1: {
            imageUrl: "w-9 h-9",
            text: "text-3xl",
            skeleton: "h-9 w-60",
            button: "h-9 w-9",
            icon: "h-6 w-6",
        },
    }

    const classNames = typeToClassNames[type]

    const onClickReverse = props.onClick
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
                                src={props.imageUrlA}
                                fallback={
                                    <QuestionMarkCircleIcon
                                        className={`${classNames.imageUrl}`}
                                    />
                                }
                            />
                            <Avatar
                                classNames={{
                                    base: `${classNames.imageUrl}`,
                                }}
                                showFallback
                                src={props.imageUrlB}
                                fallback={
                                    <QuestionMarkCircleIcon
                                        className={`${classNames.imageUrl}`}
                                    />
                                }
                            />
                        </AvatarGroup>

                        <span className={`font-bold ${classNames.text}`}>
                            {" "}
                            {props.symbolA}/{props.symbolB}{" "}
                        </span>
                    </div>
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={onClickReverse}
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

type Type = 0 | 1;

interface ClassNames {
  imageUrl: string;
  text: string;
  skeleton: string;
  button: string;
  icon: string;
}
