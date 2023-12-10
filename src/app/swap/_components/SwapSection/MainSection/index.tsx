import React, { useContext, useEffect, useRef, useState } from "react"
import {
    BalanceDisplay,
    LoadingDisplay,
    NumberTextarea,
    TokenDisplay,
} from "@app/_shared"
import { Button, Spacer } from "@nextui-org/react"
import { SwapContext } from "../../../_hooks"
import { FormikPropsContext } from "../FormikProviders"
import { RouterContract } from "@blockchain"
import { TIME_OUT } from "@config"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import {
    calculateRedenomination,
    parseNumber,
    calculateIRedenomination,
} from "@utils"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"

const MainSection = () => {
    const swapContext = useContext(SwapContext)
    if (swapContext == null) return
    const { swapState, actions } = swapContext

    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const [preventExecutionTokenOut, setPreventExecutionTokenOut] = useState(false)
    const [preventExecutionTokenIn, setPreventExecutionTokenIn] = useState(false)

    const firstTokenInRender = useRef(true)
    const [finishFetchTokenOut, setFinishFetchTokenOut] = useState(true)

    useEffect(() => {
        if (firstTokenInRender.current) {
            firstTokenInRender.current = false
            return
        }

        if (preventExecutionTokenIn) {
            setPreventExecutionTokenIn(false)
            return
        }

        console.log("Called in")
        const controller = new AbortController()
        const handleEffect = async () => {
            const tokenInAmount = formik.values.tokenInAmount
            const contract = new RouterContract(chainId)
            const tokenOutAmount = await contract.getAmountsOut(
                calculateIRedenomination(
                    parseNumber(tokenInAmount),
                    swapState.tokenOutSelected.decimals
                ),
                swapState.tokenInSelected.address,
                [],
                controller
            )
            setFinishFetchTokenOut(true)
            if (tokenOutAmount == null) return

            formik.setFieldValue(
                "tokenOutAmount",
                calculateRedenomination(
                    tokenOutAmount,
                    swapState.tokenOutSelected.decimals,
                    3
                )
            )

            setPreventExecutionTokenOut(true)
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.tokenInAmount])

    const firstTokenOutRender = useRef(true)
    const [finishFetchTokenIn, setFinishFetchTokenIn] = useState(true)

    useEffect(() => {
        if (firstTokenOutRender.current) {
            firstTokenOutRender.current = false
            return
        }

        if (preventExecutionTokenOut) {
            setPreventExecutionTokenOut(false)
            return
        }

        console.log("Called out")
        const controller = new AbortController()
        const handleEffect = async () => {
            const tokenOutAmount = formik.values.tokenOutAmount
            const contract = new RouterContract(chainId)
            const tokenInAmount = await contract.getAmountsOut(
                calculateIRedenomination(
                    parseNumber(tokenOutAmount),
                    swapState.tokenOutSelected.decimals
                ),
                swapState.tokenInSelected.address,
                [],
                controller
            )

            setFinishFetchTokenIn(true)
            if (tokenInAmount == null) return

            formik.setFieldValue(
                "tokenInAmount",
                calculateRedenomination(
                    tokenInAmount,
                    swapState.tokenInSelected.decimals,
                    3
                )
            )

            setPreventExecutionTokenIn(true)
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.tokenOutAmount])

    const handleTokenInInputChange = (value: string) => {
        formik.setFieldValue("tokenInAmount", value)
        setFinishFetchTokenOut(false)
    }

    const handleTokenOutInputChange = (value: string) => {
        formik.setFieldValue("tokenOutAmount", value)
        setFinishFetchTokenIn(false)
    }

    const _inverse = () => actions.doReverse()


    console.log(formik.values)

    // const _handleTokenInInputChange = !inverse
    //     ? handleToken0InputChange
    //     : handleToken1InputChange
    // const _handleToken1InputChange = !inverse
    //     ? handleToken1InputChange
    //     : handleToken0InputChange

    return (
        <div className="grid gap-6 justify-items-center">
            <div className="w-full">
                <div className="justify-between flex">
                    <TokenDisplay
                        finishLoad={swapState.load.finishLoadWithoutConnected}
                        tokenSymbol={swapState.tokenInSelected.symbol}
                    />
                    <BalanceDisplay
                        finishLoad={swapState.load.finishLoadWithConnected}
                        tokenBalance={swapState.tokenInSelected.balance}
                    />
                </div>
                <Spacer y={1} />
                <NumberTextarea
                    textPosition="right"
                    value={formik.values.tokenInAmount}
                    onValueChange={handleTokenInInputChange}
                />
                <LoadingDisplay
                    finishLoad={finishFetchTokenIn}
                    message="Calculating..."
                />
            </div>

            <Button
                isIconOnly
                endContent={<ArrowsUpDownIcon height={24} width={24} />}
                radius="full"
                onPress={_inverse}
            />

            <div className="w-full">
                <div className="justify-between flex">
                    <TokenDisplay
                        finishLoad={swapState.load.finishLoadWithoutConnected}
                        tokenSymbol={swapState.tokenOutSelected.symbol}
                    />
                    <BalanceDisplay
                        finishLoad={swapState.load.finishLoadWithConnected}
                        tokenBalance={swapState.tokenOutSelected.balance}
                    />
                </div>
                <Spacer y={1} />
                <NumberTextarea
                    textPosition="right"
                    value={formik.values.tokenOutAmount}
                    onValueChange={handleTokenOutInputChange}
                />
                <LoadingDisplay
                    finishLoad={finishFetchTokenOut}
                    message="Calculating..."
                />
            </div>
        </div>
    )
}

export default MainSection
