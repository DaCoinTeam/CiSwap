import React from "react"
import { PriceChart, SwapSection } from "./_components"

const Page = () => {
    return (
        <section className="max-w-[1024px] mx-auto grid grid-cols-3 gap-12">
            <PriceChart className = "col-span-2"/>
            <SwapSection className = "col-span-1"/>
        </section>
    )
}

export default Page