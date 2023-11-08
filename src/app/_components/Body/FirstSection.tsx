"use client"
import React from "react"
import { Spacer } from "@nextui-org/react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { AppButton } from "@app/_shared"
import { useRouter } from "next/navigation"
const FirstSection = () => {
    const router = useRouter()
    
    const defaultPool = useSelector(
        (state: RootState) => state.blockchain.defaultPool
    )
    const _pushSwap = ()  => router.push(`/pool/${defaultPool}/swap`)  

    return (
        <div className="min-h-[600px] grid content-center">
            <div className="w-fit h-fit">
                <div className="text-teal-500 text-8xl font-black">CiSwap</div>
                <Spacer y={2} />
                <div>Swap, Earn and Exclusive Ownership with STARCI Token!</div>
                <Spacer y={4} />
                <AppButton onPress={_pushSwap} content="Swap Now" />
            </div>
        </div>
    )
}
export default FirstSection
