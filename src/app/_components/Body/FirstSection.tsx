"use client"
import React from "react"
import { Spacer } from "@nextui-org/react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { AppButton } from "@app/_shared"
import { FactoryContract } from "@blockchain"
import { chainInfos } from "@blockchain"
import { useRouter } from "next/navigation"
const FirstSection = () => {
    const router = useRouter()

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )

    const _swap = async () => {
        const factoryContract = new FactoryContract(chainName)

        const exchangeToken = chainInfos[chainName].exchangeTokenAddress
        const stableToken = chainInfos[chainName].stableTokenAddresses[0]

        const poolAddresses = (
            await factoryContract.getPairs(exchangeToken, stableToken)
        )
        if (poolAddresses == null) return
        const poolAddress = poolAddresses[0]

        router.push(poolAddress)
    }
    return (
        <>
            <div className="min-h-[600px] grid content-center">
                <div className="w-fit h-fit">
                    <div className="text-teal-500 text-8xl font-black">CiSwap</div>
                    <Spacer y={2} />
                    <div>Swap, Earn and Exclusive Ownership with STARCI Token!</div>
                    <Spacer y={4} />
                    <AppButton onPress={_swap} content="Swap Now" darkMode={darkMode} />
                </div>
            </div>
        </>
    )
}
export default FirstSection
