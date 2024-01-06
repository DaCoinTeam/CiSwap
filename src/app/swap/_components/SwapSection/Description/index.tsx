import React from "react"
import Route from "./Route"
import LimitAmountCalculated from "./LimitAmountCalculated"
import PriceImpact from "./PriceImpact"

const Description = () => {
    return (
        <div className="w-full flex flex-col gap-1">
            <LimitAmountCalculated />
            <PriceImpact />
            <Route />
        </div>
    )
}

export default Description
