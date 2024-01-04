"use client"
import React, { createContext, useContext, useEffect, useState } from "react"

import { Card, CardBody, Spacer } from "@nextui-org/react"

import Chart from "./Chart"
import { PeriodTabs } from "@app/_shared"
import { TokenPairDisplay, TokenPriceDisplay } from "@app/_shared"
import { Period, services } from "@services"
import { SwapContext } from "../../_hooks"
import { FormikContext } from "../FormikProviders"
import utils from "@utils"
import { QuoterContract } from "@blockchain"

interface PriceChartSectionProps {
  className?: string;
}

interface PriceChartContext {
  period: {
    value: Period;
    set: React.Dispatch<React.SetStateAction<Period>>;
  };
  tickAtCrosshair: {
    value: TickAtCrosshair;
    set: React.Dispatch<React.SetStateAction<TickAtCrosshair>>;
  };
}

export const PriceChartContext = createContext<PriceChartContext | null>(null)

export const TickAtCrosshairContext = createContext<TickAtCrosshair | null>(
    null
)

const PriceChartSection = (props: PriceChartSectionProps) => {
    const { actions, swapState } = useContext(SwapContext)!
    const formik = useContext(FormikContext)!

    const [period, setPeriod] = useState(Period._24H)

    const defaultTickAtCrosshair = {
        price: 0,
        time: 0,
    }
    const [tickAtCrosshair, setTickAtCrosshair] = useState<TickAtCrosshair>(
        defaultTickAtCrosshair
    )

    useEffect(() => {
        const handleEffect = async () => {
            if (!formik.values.steps.length) return
            const path = services.next.smartRouter.encodePacked(formik.values.steps)
            const quoterContract = new QuoterContract(
                chainId,
                chainInfos[chainId].quoter
            )
            const priceX96 = await quoterContract.quotePriceX96(path)
            if (priceX96 == null) return null
            const price = utils.math.computeDivideX96(priceX96)
            formik.setFieldValue("price", price)
        }
        handleEffect()
    }, [formik.values.steps])

    useEffect(() => {
        if (!formik.values.price) return 
        setTickAtCrosshair({
            price: formik.values.price,
            time: utils.time.currentSeconds()
        })
    }, [formik.values.price])


    return (
        <Card className={`${props.className}`}>
            <CardBody className="p-5">
                <PriceChartContext.Provider
                    value={{
                        period: {
                            value: period,
                            set: setPeriod,
                        },
                        tickAtCrosshair: {
                            value: tickAtCrosshair,
                            set: setTickAtCrosshair,
                        },
                    }}
                >
                    <div className="grid md:flex justify-between gap-4">
                        <div>
                            <TokenPairDisplay
                                tokenA={swapState.infoIn.address}
                                tokenB={swapState.infoOut.address}
                                symbolA={swapState.infoIn.symbol}
                                symbolB={swapState.infoOut.symbol}
                                onClick={actions.handleReverse}
                                finishLoad={swapState.status.finishLoadBeforeConnectWallet}
                            />
                            <Spacer y={1} />
                            <TokenPriceDisplay
                                price={tickAtCrosshair.price}
                                trend={{
                                    percentage: 50,
                                    up: true,
                                }}
                                symbolA={swapState.infoIn.symbol}
                                symbolB={swapState.infoOut.symbol}
                                finishLoad={swapState.status.finishLoadBeforeConnectWallet}
                            />
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

export interface TickAtCrosshair {
  price: number;
  time: number;
}
