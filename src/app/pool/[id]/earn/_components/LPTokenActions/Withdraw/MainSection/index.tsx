import React, { useContext, useEffect, useRef, useState } from "react"
import {
    BalanceDisplay,
    LoadingDisplay,
    NumberTextarea,
    TokenDisplay,
} from "@app/_shared"
import { PoolAddressContext, TokenStateContext } from "../../../../../layout"
import { FormikPropsContext } from "../formik"
import { LiquidityPoolContract } from "@blockchain"
import { TIME_OUT } from "@config"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { calculateRedenomination, parseNumber, calculateIRedenomination } from "@utils"
import { ArrowDownIcon } from "@heroicons/react/24/outline"

const MainSection = () => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const web3 = useSelector(
        (state: RootState) => state.blockchain.web3
    )
    const account = useSelector(
        (state: RootState) => state.blockchain.account
    )

    console.log(formik.values)

    const poolAddress = useContext(PoolAddressContext)

    const firstRender = useRef(true)
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }

        if (web3 == null) return
        if (!account) return

        const controller = new AbortController()
        const handleEffect = async () => {
            const LPTokenAmountIn = formik.values.LPTokenAmountIn
            const contract = new LiquidityPoolContract(chainName, poolAddress, web3, account)
            const token0AmountOut = await contract.token0AmountOutWithLPTokensIn(
                calculateIRedenomination(parseNumber(LPTokenAmountIn),
                    tokenState.LPTokenDecimals),
                controller
            )
            setFinishFetch(true)
            if (token0AmountOut == null) return 

            formik.setFieldValue("token0AmountOut", calculateRedenomination(token0AmountOut, tokenState.token0Decimals,3))
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.LPTokenAmountIn])

    const [finishFetch, setFinishFetch] = useState(true)

    const _handleChange = (value: string) => {
        formik.setFieldValue("LPTokenAmountIn",value) 
        setFinishFetch(false)
    }
    
    return (
        <div className="w-full grid justify-items-center gap-6">
            <div className="flex items-center justify-between w-full">
                <TokenDisplay
                    finishLoad={tokenState.finishLoadWithoutConnected}
                    tokenSymbol={tokenState.LPTokenSymbol}
                />
                <BalanceDisplay
                    finishLoad={tokenState.finishLoadWithConnected}
                    tokenBalance={tokenState.LPTokenBalance}
                />
            </div>
            <NumberTextarea textPosition="right" value={formik.values.LPTokenAmountIn} onValueChange={_handleChange} />
            <ArrowDownIcon height={24} width={24} />
            <div className="w-full">
                <TokenDisplay
                    finishLoad={tokenState.finishLoadWithoutConnected}
                    tokenSymbol={tokenState.token0Symbol}
                />
                <NumberTextarea readOnly textPosition="right" value={formik.values.token0AmountOut.toString()} onValueChange={_handleChange} />
                <LoadingDisplay message="Calculating..." finishLoad={finishFetch}/>
            </div>
        </div>
    )
}

export default MainSection
