import { Skeleton, Spacer } from "@nextui-org/react"
import React, { useContext } from "react"
import { math, time } from "@utils"
import { PriceChartContext } from "../index"
import { SwapContext } from "../../../../swap/_hooks"

interface TickInfoProps {
  className?: string;
}

const TickInfo = (props: TickInfoProps) => {
    const { tickAtFirstState, tickAtCrosshairState } =
    useContext(PriceChartContext)!
    const { tickAtFirst } = tickAtFirstState
    const { tickAtCrosshair } = tickAtCrosshairState
    const { swapState } = useContext(SwapContext)!

    const renderTrend = (): JSX.Element | null => {
        const priceImpact = math.blockchain.computePriceImpact(
            tickAtCrosshairState.tickAtCrosshair.value,
            tickAtFirst.value
        )
        if (priceImpact === null) return null
        const { up, percentage } = priceImpact

        return (
            <div>
                {up ? (
                    <span className="text-teal-500"> (+{percentage}%) </span>
                ) : (
                    <span className="text-danger"> (-{percentage}%) </span>
                )}
            </div>
        )
    }

    const formatedDate = () =>
        time.formatDate(tickAtCrosshair.time as number)

    return (
        <div className={`${props.className}`}>
            {tickAtCrosshair.value > 0 ? (
                <div>
                    <div className="gap-2 flex items-end">
                        <div className="gap-1 flex items-end">
                            <span className="text-3xl font-bold">
                                {" "}
                                {tickAtCrosshair.value}{" "}
                            </span>
                            <span>
                                {" "}
                                {swapState.infoIn.symbol}/{swapState.infoOut.symbol}{" "}
                            </span>
                        </div>
                        <div>{renderTrend()}</div>
                    </div>
                    <Spacer y={1} />
                    <div>{formatedDate()}</div>
                </div>
            ) : (
                <div>
                    <Skeleton className="h-9 w-72 rounded" />
                    <Spacer y={1} />
                    <Skeleton className="h-6 w-48 rounded" />
                </div>
            )}
        </div>
    )
}

export default TickInfo
