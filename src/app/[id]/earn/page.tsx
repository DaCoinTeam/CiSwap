import React from "react"
import { LPTokenActions, LPTokenDistributionChart } from "./_components"

const Page = () => {
    return (
        <>
            <div className="grid grid-cols-3 gap-12">
                <LPTokenDistributionChart className="col-span-2" />
                <LPTokenActions className="col-span-1" />
            </div>
        </>
    )
}

export default Page
