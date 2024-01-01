import React, { useContext, useEffect, useRef, useState } from "react"
import {
    BalanceDisplay,
    LoadingDisplay,
    NumberTextarea,
    TokenDisplay,
} from "@app/_shared"
import { PoolContext } from "../../../../../_hooks"
import { FormikContext } from "../FormikProviders"
import { PoolContract } from "@blockchain"
import { TIME_OUT } from "@config"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { computeRedenomination, parseNumber } from "@utils"
import { computeDeRedenomination } from "@utils"
import { ArrowDownIcon } from "@heroicons/react/24/outline"
import { Spacer } from "@nextui-org/react"
import { MetamaskContext } from "@app/_hooks"

const MainSection = () => {
    const poolContext = useContext(PoolContext)
    if (poolContext === null) return
    const { tokenState, poolAddress } = poolContext 

    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext === null) return 
    const { web3State } = metamaskContext
    const { web3 } = web3State

    const formik = useContext(FormikContext)
    if (formik === null) return

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

        if (web3 === null) return
        if (!account) return

        const controller = new AbortController()
        const handleEffect = async () => {
            const token1DepositAmount = formik.values.token1DepositAmount
            const contract = new PoolContract(chainId, poolAddress, web3, account)
            const LPTokenAmountOut = await contract.token0AmountOut(
                computeDeRedenomination(parseNumber(token1DepositAmount),
                    tokenState.LPTokenDecimals),
                controller
            )
            setFinishFetch(true)
            if (LPTokenAmountOut === null) return 

            formik.setFieldValue("LPTokenAmountOut", computeRedenomination(LPTokenAmountOut, tokenState.LPTokenDecimals))
        }

        const delayedEffectWithBounce = setTimeout(handleEffect, TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayedEffectWithBounce)
        }
    }, [formik.values.token1DepositAmount])

    const [finishFetch, setFinishFetch] = useState(true)

    const _handleChange = (value: string) => {
        formik.setFieldValue("token1DepositAmount",value) 
        setFinishFetch(false)
    }
    
    return (
        <div className="w-full grid gap-6 justify-items-center">
            <div  className="w-full">
                <div className="flex items-center justify-between">
                    <TokenDisplay
                        finishLoad={tokenState.finishLoadWithoutConnected}
                        symbol={tokenState.token1Symbol}
                    />
                    <Spacer y={1}/>
                    <BalanceDisplay
                        finishLoad={tokenState.finishLoadWithConnected}
                        balance={tokenState.balanceB}
                    />
                </div>
                <NumberTextarea textPosition="right" value={formik.values.token1DepositAmount} onValueChange={_handleChange} />
            </div>
            <ArrowDownIcon height={24} width={24} />
     
            <div  className="w-full">
                <TokenDisplay
                    finishLoad={tokenState.finishLoadWithoutConnected}
                    symbol={tokenState.LPTokenSymbol}
                />
                <Spacer y={1}/>
                <NumberTextarea readOnly textPosition="right" value={formik.values.LPTokenAmountOut.toString()} onValueChange={_handleChange} />
                <LoadingDisplay message="Calculating..." finishLoad={finishFetch}/>
            </div>
        </div>
    )
}

export default MainSection
