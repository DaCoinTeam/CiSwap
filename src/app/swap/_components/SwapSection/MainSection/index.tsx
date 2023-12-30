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
import { QuoterContract, RouterContract } from "@blockchain"
import { TIME_OUT } from "@config"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import {
    computeRedenomination,
    parseNumber,
    computeDeRedenomination,
} from "@utils"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import numeral from "numeral"

const MainSection = () => {
    const swapContext = useContext(SwapContext)

    const formik = useContext(FormikPropsContext)
    if (formik == null) return

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
            const quoterContract = new QuoterContract(chainId)
            const amountOut = await quoterContract.quoteExactInput(
                computeDeRedenomination(
                    parseNumber(formik.values.amountIn),
                    swapState.tokenInInfo.decimals
                ),
                swapState.tokenInInfo.address,
                [
                    "0xB0b003476e9BaaE679c5B41D002bfe77b3aBe855",
                    "0x4E0B265B5e253A76aD2D469c31721fFBf2f38120",
                ],
                controller
            )
            setFinishExecuteOut(true)
            if (amountOut == null) return

            formik.setFieldValue(
                "amountOut",
                computeRedenomination(amountOut, swapState.tokenOutInfo.decimals, 3)
            )

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
            const routerContract = new RouterContract(chainId)
            const amountIn = await routerContract.getAmountsIn(
                computeDeRedenomination(
                    parseNumber(formik.values.amountOut),
                    swapState.tokenOutInfo.decimals
                ),
                swapState.tokenInInfo.address,
                [
                    "0xB0b003476e9BaaE679c5B41D002bfe77b3aBe855",
                    "0x4E0B265B5e253A76aD2D469c31721fFBf2f38120",
                ],
                controller
            )

            setFinishExecuteIn(true)
            if (amountIn == null) return

            formik.setFieldValue(
                "amountIn",
                computeRedenomination(amountIn, swapState.tokenInInfo.decimals, 3)
            )

            setPreventExecutionIn(true)
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.amountOut])

    const handleInChange = (value: string) => {
        formik.setFieldValue("amountIn", value)
        setFinishExecuteOut(false)
    }

    const handleOutChange = (value: string) => {
        formik.setFieldValue("amountOut", value)
        setFinishExecuteIn(false)
    }

    if (swapContext == null) return
    const { swapState, actions } = swapContext
    const { doReverse } = actions

    const _handleReverse = async () => {
        await doReverse()
        formik.setFieldValue("amountIn", formik.values.amountOut)
        setFinishExecuteOut(false)
    }

    return (
        <div className="grid gap-6 justify-items-center">
            <div className="w-full">
                <div className="justify-between flex">
                    <TokenDisplay
                        finishLoad={swapState.load.finishLoadWithoutConnected}
                        symbol={swapState.tokenInInfo.symbol}
                    />
                    <BalanceDisplay
                        finishLoad={swapState.load.finishLoadWithConnected}
                        balance={numeral(swapState.tokenInInfo.balance).format("0.0a")}
                    />
                </div>
                <Spacer y={1} />
                <NumberTextarea
                    textPosition="right"
                    value={formik.values.amountIn}
                    onValueChange={handleInChange}
                />
                <LoadingDisplay finishLoad={finishExecuteIn} message="Calculating..." />
            </div>

            <Button
                isIconOnly
                endContent={<ArrowsUpDownIcon height={24} width={24} />}
                radius="full"
                onPress={_handleReverse}
            />

            <div className="w-full">
                <div className="justify-between flex">
                    <TokenDisplay
                        finishLoad={swapState.load.finishLoadWithoutConnected}
                        symbol={swapState.tokenOutInfo.symbol}
                    />
                    <BalanceDisplay
                        finishLoad={swapState.load.finishLoadWithConnected}
                        balance={numeral(swapState.tokenOutInfo.balance).format("0.0f")}
                    />
                </div>
                <Spacer y={1} />
                <NumberTextarea
                    textPosition="right"
                    value={formik.values.amountOut}
                    onValueChange={handleOutChange}
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
