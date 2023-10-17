"use client"
import { Card, CardBody } from "@nextui-org/react"
import React, { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { DataWidgetDisplay } from "@app/_shared"
import Withdraw from "./Withdraw"
import Deposit from "./Deposit"
import { PoolAddressContext, TokenStateContext } from "../../../layout"
import { LiquidityPoolContract } from "@blockchain"

interface LPTokenActionsProps {
  className?: string;
}

const LPTokenActions = (props: LPTokenActionsProps) => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const poolAddress = useContext(PoolAddressContext)

    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const account = useSelector(
        (state: RootState) => state.blockchain.account
    )

    const web3 = useSelector(
        (state: RootState) => state.blockchain.web3
    )
    
    const [isProviderRegistered, setIsProviderRegistered] = useState(false)
    useEffect(() => {
        if (web3 == null || !account) return
        const handleEffect = async () => {
            const contract = new LiquidityPoolContract(chainName, poolAddress, web3, account)
            const _isProviderRegistered = await contract.isProviderRegistered()
            if (_isProviderRegistered == null) return
            setIsProviderRegistered(_isProviderRegistered)
        }
        handleEffect()
    }, [account])
    
    return (
        <Card className={`${props.className}`}>
            <CardBody className="flex flex-cols justify-between">
                <DataWidgetDisplay
                    title="Your Balance"
                    value={tokenState.LPTokenBalance}
                    prefix={tokenState.LPTokenSymbol}
                    size="lg"
                />
                <div className="grid grid-cols-2 gap-4">
                    <Withdraw />
                    <Deposit />
                </div>
            </CardBody>
        </Card>
    )
}

export default LPTokenActions