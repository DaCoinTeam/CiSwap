import React, { useContext, useEffect, useRef, useState } from "react"
import {
    BalanceDisplay,
    LoadingDisplay,
    NumberTextarea,
    TokenDisplay,
} from "@app/_shared"
import { Button } from "@nextui-org/react"
import { PoolContext } from "../../../../layout"
import { FormikPropsContext } from "../formik"
import { LiquidityPoolContract } from "@blockchain"
import { TIME_OUT } from "@config"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { calculateRedenomination, parseNumber, calculateIRedenomination } from "@utils"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"

const MainSection = () => {
    const context = useContext(PoolContext)
    if (context == null) return
    const { tokenState, poolAddress } = context
    
    if (tokenState == null) return

    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )


    const [preventExecutionToken1, setPreventExecutionToken1] = useState(false)
    const [preventExecutionToken0, setPreventExecutionToken0] = useState(false)

    const firstToken0Render = useRef(true)
    const [finishFetchToken1, setFinishFetchToken1] = useState(true)
    
    const [inverseChanged, setInverseChanged] = useState(false)
    const [inverse, setInverse] = useState(false)

    useEffect(() => {
        if (firstToken0Render.current) {
            firstToken0Render.current = false
            return
        }

        if (preventExecutionToken0) {
            setPreventExecutionToken0(false)
            return
        }

        if (inverseChanged && inverse) return

        console.log("Called 0")
        const controller = new AbortController()
        const handleEffect = async () => {
            const token0Amount = formik.values.token0Amount
            const contract = new LiquidityPoolContract(
                chainName,
                poolAddress
            )
            const token1AmountOut = await contract.token1AmountOut(
                calculateIRedenomination(
                    parseNumber(token0Amount),
                    tokenState.token0Decimals
                ),
                controller
            )
            setFinishFetchToken1(true)
            if (token1AmountOut == null) return

            formik.setFieldValue(
                "token1Amount",
                calculateRedenomination(token1AmountOut, tokenState.token1Decimals, 3)
            )

            setPreventExecutionToken1(true)
            setInverseChanged(false)
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.token0Amount, inverse])

    const firstToken1Render = useRef(true)
    const [finishFetchToken0, setFinishFetchToken0] = useState(true)

    useEffect(() => {
        if (firstToken1Render.current) {
            firstToken1Render.current = false
            return
        }

        if (preventExecutionToken1) {
            setPreventExecutionToken1(false)
            return
        }

        if (inverseChanged && !inverse) return

        console.log("Called 1")
        const controller = new AbortController()
        const handleEffect = async () => {
            const token1Amount = formik.values.token1Amount
            const contract = new LiquidityPoolContract(
                chainName,
                poolAddress
            )
            const token0AmountOut = await contract.token0AmountOut(
                calculateIRedenomination(
                    parseNumber(token1Amount),
                    tokenState.token1Decimals
                ),
                controller
            )

            setFinishFetchToken0(true)
            if (token0AmountOut == null) return

            formik.setFieldValue(
                "token0Amount",
                calculateRedenomination(token0AmountOut, tokenState.token0Decimals, 3)
            )

            setPreventExecutionToken0(true)
            setInverseChanged(false)
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.token1Amount, inverse])

    const handleToken0InputChange = (value: string) => {
        formik.setFieldValue("token0Amount", value)
        setFinishFetchToken1(false)
    }

    const handleToken1InputChange = (value: string) => {
        formik.setFieldValue("token1Amount", value)
        setFinishFetchToken0(false)
    }

    const _inverse = () => {
        const _inverse = !inverse
        setInverse(_inverse)
        formik.setFieldValue("_isBuyAction", !inverse)
        if (_inverse){
            setFinishFetchToken0(false)
        } else {
            setFinishFetchToken1(false)
        }
        setInverseChanged(true)
    }

    console.log(formik.values)
    
    const _token0Symbol = !inverse
        ? tokenState.token0Symbol
        : tokenState.token1Symbol
    const _token1Symbol = !inverse
        ? tokenState.token1Symbol
        : tokenState.token0Symbol

    const _token0Balance = !inverse
        ? tokenState.token0Balance
        : tokenState.token1Balance
    const _token1Balance = !inverse
        ? tokenState.token1Balance
        : tokenState.token0Balance

    const _token0Amount = !inverse
        ? formik.values.token0Amount
        : formik.values.token1Amount
    const _token1Amount = !inverse
        ? formik.values.token1Amount
        : formik.values.token0Amount

    const _handleToken0InputChange = !inverse
        ? handleToken0InputChange
        : handleToken1InputChange
    const _handleToken1InputChange = !inverse
        ? handleToken1InputChange
        : handleToken0InputChange

    const _finishFetchToken0 = !inverse ? finishFetchToken0 : finishFetchToken1
    const _finishFetchToken1 = !inverse ? finishFetchToken1 : finishFetchToken0

    return (
        <div className="grid gap-6 justify-items-center">
            <div className="w-full">
                <div className="justify-between flex">
                    <TokenDisplay
                        finishLoad={tokenState.finishLoadWithoutConnected}
                        tokenSymbol={_token0Symbol}
                    />
                    <BalanceDisplay
                        finishLoad={tokenState.finishLoadWithConnected}
                        tokenBalance={_token0Balance}
                    />
                </div>
                <NumberTextarea
                    textPosition="right"
                    value={_token0Amount}
                    onValueChange={_handleToken0InputChange}
                />
                <LoadingDisplay
                    finishLoad={_finishFetchToken0}
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
                        finishLoad={tokenState.finishLoadWithoutConnected}
                        tokenSymbol={_token1Symbol}
                    />
                    <BalanceDisplay
                        finishLoad={tokenState.finishLoadWithConnected}
                        tokenBalance={_token1Balance}
                    />
                </div>
                <NumberTextarea
                    textPosition="right"
                    value={_token1Amount}
                    onValueChange={_handleToken1InputChange}
                />
                <LoadingDisplay
                    finishLoad={_finishFetchToken1}
                    message="Calculating..."
                />
            </div>
        </div>
    )
}

export default MainSection
