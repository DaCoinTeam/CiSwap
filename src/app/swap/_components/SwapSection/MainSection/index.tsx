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

    const formik = useContext(FormikContext)!

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const [preventOut, setPreventOut] = useState(false)
    const [preventIn, setPreventIn] = useState(false)

    const [finishIn, setFinishIn] = useState(true)
    const [finishOut, setFinishOut] = useState(true)

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
            setFinishOut(true)
            if (quote === null) return

            formik.setFieldValue("amountOutRaw", quote.amountOutRaw)
            formik.setFieldValue(
                "amountOut",
                utils.math.computeRedenomination(
                    quote.amountOutRaw,
                    swapState.infoOut.decimals
                )
            )
            formik.setFieldValue("exactInput", true)
            formik.setFieldValue("steps", quote.path.steps)

            setPreventOut(true)
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
            setFinishIn(true)
            if (quote === null) return
            formik.setFieldValue("amountInRaw", quote.amountInRaw)
            formik.setFieldValue(
                "amountIn",
                utils.math.computeRedenomination(
                    quote.amountInRaw,
                    swapState.infoIn.decimals
                )
            )
            formik.setFieldValue("exactInput", false)
            formik.setFieldValue("steps", quote.path.steps)

            setPreventIn(true)
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.amountOut])

    const onChangeIn = (value: string) => {
        formik.setFieldValue("amountIn", value)
        formik.setFieldValue(
            "amountInRaw",
            utils.math.computeRaw(
                utils.format.parseStringToNumber(value),
                swapState.infoIn.decimals
            )
        )

        setFinishOut(false)
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
        setFinishIn(false)
    }

    const onClickReverse = actions.handleReverse

    const infoInHasMountedRef = useRef(true)
    useEffect(() => {
        if (infoInHasMountedRef.current) {
            infoInHasMountedRef.current = false
            return
        }
        if (!swapState.status.finishLoadBeforeConnectWallet) return

        const handleEffect = async () => {
            formik.setFieldValue("amountIn", formik.values.amountOut)
            setFinishOut(false)
        }
        handleEffect()
    }, [swapState.infoIn.address])

    return (
        <div className="grid gap-6 justify-items-center">
            <div className="w-full">
                <div className="justify-between flex">
                    <TokenDisplay
                        finishLoad={swapState.status.finishLoadBeforeConnectWallet}
                        symbol={swapState.infoIn.symbol}
                    />
                    <BalanceDisplay
                        finishLoad={swapState.status.finishLoadAfterConnectWallet}
                        balance={swapState.infoIn.balance}
                    />
                </div>
                <Spacer y={1} />
                <NumberTextarea
                    textPosition="right"
                    value={formik.values.amountIn}
                    onValueChange={onChangeIn}
                    isDisabled={!finishIn}
                />
                <LoadingDisplay finishLoad={finishIn} message="Calculating..." />
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
                        finishLoad={swapState.status.finishLoadBeforeConnectWallet}
                        symbol={swapState.infoOut.symbol}
                    />
                    <BalanceDisplay
                        finishLoad={swapState.status.finishLoadAfterConnectWallet}
                        balance={swapState.infoOut.balance}
                    />
                </div>
                <Spacer y={1} />
                <NumberTextarea
                    textPosition="right"
                    value={formik.values.amountOut}
                    onValueChange={onChangeOut}
                    isDisabled={!finishOut}
                />
                <LoadingDisplay finishLoad={finishOut} message="Calculating..." />
            </div>
        </div>
    )
}

export default MainSection
