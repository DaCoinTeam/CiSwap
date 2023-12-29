import React, { useContext, useEffect, useRef, useState } from "react"
import {
    BalanceDisplay,
    LoadingDisplay,
    NumberTextarea,
    TokenDisplay,
} from "@app/_shared"
import { PoolContext } from "../../../../../_hooks"
import { FormikPropsContext } from "../FormikProviders"
import { PoolContract } from "@blockchain"
import { TIME_OUT } from "@config"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { computeRedenomination, parseNumber, computeDeRedenomination } from "@utils"
import { ArrowDownIcon } from "@heroicons/react/24/outline"
import { Spacer } from "@nextui-org/react"
import { MetamaskContext } from "@app/_hooks"

const MainSection = () => {
    const poolContext = useContext(PoolContext)
    if (poolContext == null) return
    const { tokenState, poolAddress } = poolContext 

    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext == null) return 
    const { web3State } = metamaskContext
    const { web3 } = web3State

    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const chainId = useSelector(
        (state: RootState) => state.blockchain.chainId
    )

    const account = useSelector(
        (state: RootState) => state.blockchain.account
    )

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
            const contract = new PoolContract(chainId, poolAddress, web3, account)
            const token0AmountOut = await contract.token0AmountOutWithLPTokensIn(
                computeDeRedenomination(parseNumber(LPTokenAmountIn),
                    tokenState.LPTokenDecimals),
                controller
            )
            setFinishFetch(true)
            if (token0AmountOut == null) return 

            formik.setFieldValue("token0AmountOut", computeRedenomination(token0AmountOut, tokenState.token0Decimals,3))
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
            <div className="w-full">
                <div className="flex items-center justify-between w-full">
                    <TokenDisplay
                        finishLoad={tokenState.finishLoadWithoutConnected}
                        symbol={tokenState.LPTokenSymbol}
                    />
                    <BalanceDisplay
                        finishLoad={tokenState.finishLoadWithConnected}
                        balance={tokenState.LPTokenBalance}
                    />
                </div>
                <Spacer y={1}/>
                <NumberTextarea textPosition="right" value={formik.values.LPTokenAmountIn} onValueChange={_handleChange} />
            </div>
            <ArrowDownIcon height={24} width={24} />
            <div className="w-full">
                <TokenDisplay
                    finishLoad={tokenState.finishLoadWithoutConnected}
                    symbol={tokenState.token0Symbol}
                />
                <Spacer y={1}/>
                <NumberTextarea readOnly textPosition="right" value={formik.values.token0AmountOut.toString()} onValueChange={_handleChange} />
                <LoadingDisplay message="Calculating..." finishLoad={finishFetch}/>
            </div>
        </div>
    )
}

export default MainSection
