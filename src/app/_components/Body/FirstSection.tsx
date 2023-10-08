"use client"
import React from "react"
import { Spacer } from "@nextui-org/react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { AppButton } from "@app/_shared"
const FirstSection = () => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    const _swap = () => {}
    return (
        <section>
            <div className="m-auto max-w-[1024px] min-h-[600px] grid content-center">
                <div className="w-fit h-fit">
                    <div className="text-teal-500 text-8xl font-black">StarSwap</div>
                    <Spacer y={2}/>
                    <div>
            Swap, Earn and Exclusive Ownership with STARCI Token!
                    </div>
                    <Spacer y={4}/>
                    <AppButton
                        onPress={_swap}
                        content="Swap Now"
                        darkMode={darkMode}
                    />
                </div>
            </div>
        </section>
    )
}
export default FirstSection
