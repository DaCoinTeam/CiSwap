"use client"
import { Card, CardBody } from "@nextui-org/react"
import React, { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { AppButton, TokenTooltipDisplay } from "@app/_shared"
import Withdraw from "./Withdraw"
import Deposit from "./Deposit"
import { PoolContext } from "../../../layout"
import { LiquidityPoolContract } from "@blockchain"

interface LPTokenActionsProps {
  className?: string;
}

const LPTokenActions = (props: LPTokenActionsProps) => {
    const context = useContext(PoolContext)
    if (context == null) return
    const { tokenState, poolAddress } = context

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const account = useSelector((state: RootState) => state.blockchain.account)

    const web3 = useSelector((state: RootState) => state.blockchain.web3)

    const [isProviderRegistered, setIsProviderRegistered] = useState(false)
    useEffect(() => {
        if (web3 == null || !account) return
        const handleEffect = async () => {
            const contract = new LiquidityPoolContract(
                chainName,
                poolAddress
            )  
            const _isProviderRegistered = await contract.isProviderRegistered(account)
            if (_isProviderRegistered == null) return
            setIsProviderRegistered(_isProviderRegistered)
        }
        handleEffect()
    }, [account])

    const _handleRegisterProvider = async () => {
        if (web3 == null || !account) return
        const contract = new LiquidityPoolContract(chainName, poolAddress, web3, account)
        const receipt = await contract.registerProvider()
        console.log(receipt)
    }

    const _renderOptions = () => {
        return !isProviderRegistered ? (
            <AppButton
                content="Register Provider"
                onPress={_handleRegisterProvider}
            />
        ) : (
            <div className="grid grid-cols-2 gap-4">
                <Withdraw />
                <Deposit />
            </div>
        )
    }

    return (
        <Card className={`${props.className}`}>
            <CardBody className="flex flex-cols p-5 justify-between">
                <TokenTooltipDisplay 
                    tooltipContent="Your LP Token balance"
                    value={tokenState.LPTokenBalance}
                    prefix={tokenState.LPTokenSymbol}
                    finishLoad={tokenState.finishLoadWithConnected}
                />
               
                {_renderOptions()}
            </CardBody>
        </Card>
    )
}

export default LPTokenActions
