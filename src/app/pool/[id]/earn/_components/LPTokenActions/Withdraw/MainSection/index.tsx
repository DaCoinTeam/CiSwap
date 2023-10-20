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
import { calculateRedenomination, parseNumber, calculateIRedenomination } from "@utils"

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
        <div className="w-full">
            <div className="flex items-center justify-between">
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
            <Spacer y={6}/>
            <DataWidgetDisplay
                title={`${tokenState.token0Symbol  } Received`}
                value={formik.values.token0AmountOut }
                prefix={tokenState.token0Symbol }
                finishLoad={true}
            />
            <LoadingDisplay message="Calculating..." finishLoad={finishFetch}/>
        </div>
    )
}

export default MainSection
