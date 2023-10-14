import React from "react"
import { PriceChart, SwapSection } from "./_components"

const Page = () => {
    return (
        <>
            <div className="grid grid-cols-3 gap-12">
                <PriceChart className = "col-span-2"/>
                <SwapSection className = "col-span-1"/>
            </div>
        </>
    )
}

export default Page