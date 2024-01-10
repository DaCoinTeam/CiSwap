"use client"
import React, { createContext, useContext, useMemo, useState } from "react"

import { Card, CardBody, Spacer } from "@nextui-org/react"

import Chart from "./Chart"
import { PeriodTabs, TokenPairDisplay } from "@app/_shared"
import TickInfo from "./TickInfo"

import { Period } from "@services"
import { SwapContext } from "../../_hooks"
import { BaselineData, Time } from "lightweight-charts"

interface PriceChartSectionProps {
  className?: string;
}

interface PriceChartContext {
  periodState: {
    period: Period;
    setPeriod: React.Dispatch<React.SetStateAction<Period>>;
  };
  tickAtCrosshairState: {
    tickAtCrosshair: BaselineData<Time>;
    setTickAtCrosshair: React.Dispatch<
      React.SetStateAction<BaselineData<Time>>
    >;
  };
  tickAtFirstState: {
    tickAtFirst: BaselineData<Time>;
    setTickAtFirst: React.Dispatch<React.SetStateAction<BaselineData<Time>>>;
  };
}

export const PriceChartContext = createContext<PriceChartContext | null>(null)

const PriceChartSection = (props: PriceChartSectionProps) => {
    const { actions, swapState } = useContext(SwapContext)!

    const [period, setPeriod] = useState(Period._24H)

    const initialTick: BaselineData<Time> = {
        time: 0 as Time,
        value: 0,
    }
    const [tickAtCrosshair, setTickAtCrosshair] =
    useState<BaselineData<Time>>(initialTick)

    const [tickAtFirst, setTickAtFirst] =
    useState<BaselineData<Time>>(initialTick)

    const priceChartContext: PriceChartContext = useMemo(() => {
        return {
            periodState: {
                period,
                setPeriod,
            },
            tickAtFirstState: {
                tickAtFirst,
                setTickAtFirst,
            },
            tickAtCrosshairState: {
                tickAtCrosshair,
                setTickAtCrosshair,
            },
        }
    }, [
        period,
        setPeriod,
        tickAtFirst,
        setTickAtFirst,
        tickAtCrosshair,
        setTickAtCrosshair,
    ])

    return (
        <Card className={`${props.className}`}>
            <CardBody className="p-5">
                <PriceChartContext.Provider value={priceChartContext}>
                    <div className="grid md:flex justify-between gap-4">
                        <div>
                            <TokenPairDisplay
                                symbolA={swapState.infoIn.symbol}
                                symbolB={swapState.infoOut.symbol}
                                onClick={actions.handleReverse}
                                finishLoad={swapState.status.finishLoadBeforeConnectWallet}
                            />
                            <Spacer y={1} />
                            <TickInfo />
                        </div>
                        <PeriodTabs tab={period} setTab={setPeriod} />
                    </div>
                    <Spacer y={6} />
                    <Chart />
                </PriceChartContext.Provider>
            </CardBody>
        </Card>
    )
}

export default PriceChartSection
