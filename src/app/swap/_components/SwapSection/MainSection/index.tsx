import React, { useContext, useEffect, useRef, useState } from "react"
import {
    BalanceDisplay,
    LoadingDisplay,
    NumberTextarea,
    TokenDisplay,
} from "@app/_shared"
import { Button, Spacer } from "@nextui-org/react"
import { SwapContext } from "../../../_hooks"
import { FormikContext } from "../../FormikProviders"
import { TIME_OUT } from "@config"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import utils from "@utils"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import { services } from "@services"

const MainSection = () => {
    const swapContext = useContext(SwapContext)!
    const { swapState, actions } = swapContext
    const { doReverse } = actions

    const formik = useContext(FormikContext)!

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const [preventExecutionOut, setPreventExecutionOut] = useState(false)
    const [preventExecutionIn, setPreventExecutionIn] = useState(false)

    const firstInRef = useRef(true)
    const [finishExecuteOut, setFinishExecuteOut] = useState(true)

    useEffect(() => {
        if (firstInRef.current) {
            firstInRef.current = false
            return
        }

        if (preventExecutionIn) {
            setPreventExecutionIn(false)
            return
        }

        const controller = new AbortController()
        const handleEffect = async () => {
            const quote = await services.next.smartRouter.findBestQuote(
                chainId,
                utils.math.computeDeRedenomination(
                    utils.format.parseNumber(formik.values.amountIn),
                    swapState.infoIn.decimals
                ),
                swapState.infoIn.address,
                swapState.infoOut.address,
                true
            )
            setFinishExecuteOut(true)
            if (quote === null) return
            console.log(  utils.math.computeRedenomination(
                quote.amountOut,
                swapState.infoOut.decimals,
                3
            ))
            console.log(quote.amountOut)
            formik.setFieldValue(
                "amountOut",
                utils.math.computeRedenomination(
                    quote.amountOut,
                    swapState.infoOut.decimals
                )
            )
            formik.setFieldValue("exactInput", false)
            formik.setFieldValue("steps", quote.path.steps)

            setPreventExecutionOut(true)
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.amountIn])

    const firstOutRef = useRef(true)
    const [finishExecuteIn, setFinishExecuteIn] = useState(true)

    useEffect(() => {
        if (firstOutRef.current) {
            firstOutRef.current = false
            return
        }

        if (preventExecutionOut) {
            setPreventExecutionOut(false)
            return
        }

        const controller = new AbortController()
        const handleEffect = async () => {
            const quote = await services.next.smartRouter.findBestQuote(
                chainId,
                utils.math.computeDeRedenomination(
                    utils.format.parseNumber(formik.values.amountOut),
                    swapState.infoIn.decimals
                ),
                swapState.infoIn.address,
                swapState.infoOut.address,
                false
            )
            setFinishExecuteIn(true)
            if (quote === null) return

            formik.setFieldValue(
                "amountIn",
                utils.math.computeRedenomination(
                    quote.amountIn,
                    swapState.infoIn.decimals
                )
            )

            formik.setFieldValue("exactInput", true)
            formik.setFieldValue("steps", quote.path.steps)

            setPreventExecutionIn(true)
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.amountOut])

    const onChangeIn = (value: string) => {
        formik.setFieldValue("amountIn", value)
        setFinishExecuteOut(false)
    }

    const onChangeOut = (value: string) => {
        formik.setFieldValue("amountOut", value)
        setFinishExecuteIn(false)
    }

    const onClickReverse = async () => {
        await doReverse()
        formik.setFieldValue("amountIn", formik.values.amountOut)
        setFinishExecuteOut(false)
    }

    return (
        <div className="grid gap-6 justify-items-center">
            <div className="w-full">
                <div className="justify-between flex">
                    <TokenDisplay
                        finishLoad={swapState.state.finishUpdateBeforeConnected}
                        symbol={swapState.infoIn.symbol}
                    />
                    <BalanceDisplay
                        finishLoad={swapState.state.finishUpdateAfterConnected}
                        balance={swapState.infoIn.balance}
                    />
                </div>
                <Spacer y={1} />
                <NumberTextarea
                    textPosition="right"
                    value={formik.values.amountIn}
                    onValueChange={onChangeIn}
                />
                <LoadingDisplay finishLoad={finishExecuteIn} message="Calculating..." />
            </div>

            <Button
                isIconOnly
                endContent={<ArrowsUpDownIcon height={24} width={24} />}
                radius="full"
                onPress={onClickReverse}
            />

            <div className="w-full">
                <div className="justify-between flex">
                    <TokenDisplay
                        finishLoad={swapState.state.finishUpdateBeforeConnected}
                        symbol={swapState.infoOut.symbol}
                    />
                    <BalanceDisplay
                        finishLoad={swapState.state.finishUpdateAfterConnected}
                        balance={swapState.infoOut.balance}
                    />
                </div>
                <Spacer y={1} />
                <NumberTextarea
                    textPosition="right"
                    value={formik.values.amountOut}
                    onValueChange={onChangeOut}
                />
                <LoadingDisplay
                    finishLoad={finishExecuteOut}
                    message="Calculating..."
                />
            </div>
        </div>
    )
}

export default MainSection
