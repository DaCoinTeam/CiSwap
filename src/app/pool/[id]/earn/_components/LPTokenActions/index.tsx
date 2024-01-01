"use client"
import { Card, CardBody } from "@nextui-org/react"
import React, { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { AppButton, TokenTooltipDisplay } from "@app/_shared"
import Withdraw from "./Withdraw"
import Deposit from "./Deposit"
import { PoolContext } from "../../../_hooks"
import { PoolContract } from "@blockchain"
import { MetamaskContext } from "@app/_hooks"

interface LPTokenActionsProps {
  className?: string;
}

const LPTokenActions = (props: LPTokenActionsProps) => {
    const poolContext = useContext(PoolContext)
    if (poolContext === null) return

    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext === null) return 
    const { web3State } = metamaskContext
    const { web3 } = web3State

    const { tokenState, poolAddress } = poolContext 

    const chainId = useSelector(
        (state: RootState) => state.blockchain.chainId
    )

    const account = useSelector((state: RootState) => state.blockchain.account)



    const [isProviderRegistered, setIsProviderRegistered] = useState(false)
    useEffect(() => {
        if (web3 === null || !account) return
        const handleEffect = async () => {
            const contract = new PoolContract(
                chainId,
                poolAddress
            )  
            const _isProviderRegistered = await contract.isProviderRegistered(account)
            if (_isProviderRegistered === null) return
            setIsProviderRegistered(_isProviderRegistered)
        }
        handleEffect()
    }, [account])

    const _handleRegisterProvider = async () => {
        if (web3 === null || !account) return
        const contract = new PoolContract(chainId, poolAddress, web3, account)
        const receipt = await contract.registerProvider()
        console.log(receipt)
    }

    const _renderOptions = () => {
        return !isProviderRegistered ? (
            <AppButton
                text="Register Provider"
                onClick={_handleRegisterProvider}
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
