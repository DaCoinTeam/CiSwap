import { Skeleton, Spacer } from "@nextui-org/react"
import React, { useContext } from "react"
import utils from "@utils"
import { TickAtCrosshair } from "../index"
import { SwapContext } from "../../../../swap/_hooks"

interface TickInfoProps {
  className?: string;
  imageUrlA?: string;
  imageUrlB?: string;
  tickAtCrosshair: TickAtCrosshair;
  trend: Trend;
}

const TickInfo = (props: TickInfoProps) => {
    const { swapState } = useContext(SwapContext)!
    const renderTrend = () => <div></div>

    return (
        <div className={`${props.className}`}>
            {swapState.status.finishLoadBeforeConnectWallet ? (
                <div>
                    <div className="gap-2 flex items-end">
                        <div className="gap-1 flex items-end">
                            <span className="text-3xl font-bold">
                                {" "}
                                {props.tickAtCrosshair.price}{" "}
                            </span>
                            <span>
                                {" "}
                                {swapState.infoIn.symbol}/{swapState.infoOut.symbol}{" "}
                            </span>
                        </div>
                        <div>{renderTrend()}</div>
                    </div>
                    <Spacer y={0.5} />
                    <div>{utils.time.formatDate(props.tickAtCrosshair.time)}</div>
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

interface Trend {
  up: boolean;
  percentage: number;
}
