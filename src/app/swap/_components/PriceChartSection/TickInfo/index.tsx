import { Skeleton, Spacer } from "@nextui-org/react"
import React, { useContext } from "react"
import utils from "@utils"
import { PriceChartContext } from "../index"
import { SwapContext } from "../../../../swap/_hooks"

interface TickInfoProps {
  className?: string;
}

const TickInfo = (props: TickInfoProps) => {
    const { tickAtCrosshair, tickAtFirst } = useContext(PriceChartContext)!
    const { swapState } = useContext(SwapContext)!

    const renderTrend = (): JSX.Element | null => {
        const priceImpact = utils.math.computePriceImpact(
            tickAtCrosshair.value.value,
            tickAtFirst.value.value
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
        utils.time.formatDate(tickAtCrosshair.value.time as number)

    return (
        <div className={`${props.className}`}>
            {swapState.status.finishLoadBeforeConnectWallet ? (
                <div>
                    <div className="gap-2 flex items-end">
                        <div className="gap-1 flex items-end">
                            <span className="text-3xl font-bold">
                                {" "}
                                {tickAtCrosshair.value.value}{" "}
                            </span>
                            <span>
                                {" "}
                                {swapState.infoIn.symbol}/{swapState.infoOut.symbol}{" "}
                            </span>
                        </div>
                        <div>{renderTrend()}</div>
                    </div>
                    <Spacer y={0.5} />
                    <div>{formatedDate()}</div>
                </div>
            ) : (
                <>
                    <Skeleton className="h-9 w-48 rounded" />
                </>
            )}
        </div>
    )
}

export default TickInfo
