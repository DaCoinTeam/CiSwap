import React from "react"
import { LPTokenActions, LPTokenDistributionChart } from "./_components"

const Page = () => {
    return (
        <section className="max-w-[1024px] mx-auto grid grid-cols-3 gap-12">
            <LPTokenDistributionChart className = "col-span-2"/>
            <LPTokenActions className = "col-span-1"/>
        </section>
    )
}

export default Page