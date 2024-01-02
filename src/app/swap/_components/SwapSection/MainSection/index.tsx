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
import { TIME_OUT, chainInfos } from "@config"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import utils from "@utils"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import { services } from "@services"
import { QuoterContract } from "@blockchain"

const MainSection = () => {
    const swapContext = useContext(SwapContext)!
    const { swapState, actions } = swapContext

    const formik = useContext(FormikContext)!

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const [preventOut, setPreventOut] = useState(false)
    const [preventIn, setPreventIn] = useState(false)

    const amountInHasMounted = useRef(true)
    useEffect(() => {
        if (amountInHasMounted.current) {
            amountInHasMounted.current = false
            return
        }

        if (preventIn) {
            setPreventIn(false)
            return
        }

        const controller = new AbortController()
        const handleEffect = async () => {
            try {
                const quote = await services.next.smartRouter.findBestQuote(
                    chainId,
                    utils.math.computeRaw(
                        utils.format.parseStringToNumber(formik.values.amountIn),
                        swapState.infoIn.decimals
                    ),
                    swapState.infoIn.address,
                    swapState.infoOut.address,
                    true
                )
                formik.setFieldValue("finishOut", true)
                if (quote === null) return

                formik.setFieldValue("amountOutRaw", quote.amountOut)
                formik.setFieldValue(
                    "amountOut",
                    utils.math.computeRedenomination(
                        quote.amountOut,
                        swapState.infoOut.decimals
                    )
                )
                formik.setFieldValue("exactInput", false)
                formik.setFieldValue("steps", quote.path.steps)
            } finally {
                setPreventOut(true)
            }
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.amountIn])

    const amountOutHasMounted = useRef(true)

    useEffect(() => {
        if (amountOutHasMounted.current) {
            amountOutHasMounted.current = false
            return
        }

        if (preventOut) {
            setPreventOut(false)
            return
        }

        const controller = new AbortController()
        const handleEffect = async () => {
            try {
                const quote = await services.next.smartRouter.findBestQuote(
                    chainId,
                    utils.math.computeRaw(
                        utils.format.parseStringToNumber(formik.values.amountOut),
                        swapState.infoIn.decimals
                    ),
                    swapState.infoIn.address,
                    swapState.infoOut.address,
                    false
                )
                formik.setFieldValue("finishIn", true)
                if (quote === null) return
                formik.setFieldValue("amountInRaw", quote.amountIn)
                formik.setFieldValue(
                    "amountIn",
                    utils.math.computeRedenomination(
                        quote.amountIn,
                        swapState.infoIn.decimals
                    )
                )
                formik.setFieldValue("exactInput", true)
                formik.setFieldValue("steps", quote.path.steps)
            } catch {
                setPreventIn(true)
            }
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.amountOut])

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

    const onChangeIn = (value: string) => {
        formik.setFieldValue("amountIn", value)
        formik.setFieldValue(
            "amountInRaw",
            utils.math.computeRaw(
                utils.format.parseStringToNumber(value),
                swapState.infoIn.decimals
            )
        )

        formik.setFieldValue("finishOut", false)
    }

    const onChangeOut = (value: string) => {
        formik.setFieldValue("amountOut", value)
        formik.setFieldValue(
            "amountOutRaw",
            utils.math.computeRaw(
                utils.format.parseStringToNumber(value),
                swapState.infoOut.decimals
            )
        )
        formik.setFieldValue("finishIn", false)
    }

    const onClickReverse = actions.handleReverse

    const infoInHasMountedRef = useRef(true)
    useEffect(() => {
        if (infoInHasMountedRef.current) {
            infoInHasMountedRef.current = false
            return
        }
        const handleEffect = async () => {
            formik.setFieldValue("amountIn", formik.values.amountOut)
            formik.setFieldValue("finishOut", false)
        }
        handleEffect()
    }, [swapState.infoIn])

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
                <LoadingDisplay
                    finishLoad={formik.values.finishIn}
                    message="Calculating..."
                />
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
                    finishLoad={formik.values.finishIn}
                    message="Calculating..."
                />
            </div>
        </div>
    )
}

export default MainSection
