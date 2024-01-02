import React from "react"
import Route from "./Route"
import MinimunReceived from "./MinimunReceived"
import PriceImpact from "./PriceImpact"

const Description = () => {
    return (
        <div className="w-full flex flex-col gap-1">
            <MinimunReceived />
            <PriceImpact />
            <Route />
        </div>
    )
}

export default Description
