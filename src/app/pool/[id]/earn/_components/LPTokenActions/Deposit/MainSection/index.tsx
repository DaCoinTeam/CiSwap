import React, { useContext, useEffect, useRef, useState } from "react"
import {
    BalanceDisplay,
    DataWidgetDisplay,
    LoadingDisplay,
    NumberTextarea,
    TokenDisplay,
} from "@app/_shared"
import { Spacer } from "@nextui-org/react"
import { PoolAddressContext, TokenStateContext } from "../../../../../layout"
import { FormikPropsContext } from "../formik"
import { LiquidityPoolContract, TIME_OUT } from "@blockchain"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { calculateRedenomination, parseNumber } from "@utils"
import { calculateIRedenomination } from "@utils"

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
            const token1DepositAmount = formik.values.token1DepositAmount
            const contract = new LiquidityPoolContract(chainName, poolAddress, web3, account)
            const LPTokenAmountOut = await contract.token0AmountOut(
                calculateIRedenomination(parseNumber(token1DepositAmount),
                    tokenState.LPTokenDecimals),
                controller
            )
            setFinishFetch(true)
            if (LPTokenAmountOut == null) return 

            formik.setFieldValue("LPTokenAmountOut", calculateRedenomination(LPTokenAmountOut, tokenState.LPTokenDecimals,3))
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
        <div className="w-full">
            <div className="flex items-center justify-between">
                <TokenDisplay
                    finishLoad={tokenState.finishLoadWithoutConnected}
                    tokenSymbol={tokenState.token1Symbol}
                />
                <BalanceDisplay
                    finishLoad={tokenState.finishLoadWithConnected}
                    tokenBalance={tokenState.token1Balance}
                />
            </div>
            <NumberTextarea textPosition="right" value={formik.values.token1DepositAmount} onValueChange={_handleChange} />
            <Spacer y={0.5} />
            <Spacer y={6}/>
            <DataWidgetDisplay
                title="LP Token Received"
                value={formik.values.LPTokenAmountOut}
                prefix={tokenState.LPTokenSymbol}
                finishLoad={true}
            />
            <LoadingDisplay message="Calculating..." finishLoad={finishFetch}/>
        </div>
    )
}

export default MainSection
