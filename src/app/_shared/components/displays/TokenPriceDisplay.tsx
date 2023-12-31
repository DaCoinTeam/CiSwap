import { Skeleton } from "@nextui-org/react"
import React from "react"
import utils from "@utils"

interface TokenPriceDisplayProps {
  className?: string;
  imageUrlA?: string;
  imageUrlB?: string;
  symbolA: string;
  symbolB: string;
  price: number;
  trend: Trend;
  type?: Type;
  finishLoad?: boolean;
}

const TokenPriceDisplay = (props: TokenPriceDisplayProps) => {
    const type: Type = props.type ?? 0

    const renderTrend = () => <div></div>

    return () => {
        const typeToReturn: Record<Type, JSX.Element> = {
            0: (
                <div className={`${props.className}`}>
                    {props.finishLoad ? (
                        <>
                            <div className="gap-2 flex items-end">
                                <div className="gap-1 flex items-end">
                                    <span className="text-3xl font-bold"> {props.price} </span>
                                    <span>
                                        {" "}
                                        {props.symbolA}/{props.symbolB}{" "}
                                    </span>
                                </div>
                                <div>{renderTrend()}</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Skeleton className="h-9 w-48 rounded" />
                        </>
                    )}
                </div>
            ),
            1: (
                <div className={`${props.className}`}>
                    {props.finishLoad ? (
                        <div className="flex gap-2">
                            <span>
                1 {props.symbolA} = {props.price} {props.symbolB}{" "}
                            </span>
                            {renderTrend()}
                        </div>
                    ) : (
                        <>
                            <Skeleton className="h-6 w-60 rounded" />
                        </>
                    )}
                </div>
            ),
        }
        return typeToReturn[type]
    }
}

export default TokenPriceDisplay

type Type = 0 | 1;

interface Trend {
  up: boolean;
  percentage: number;
}
