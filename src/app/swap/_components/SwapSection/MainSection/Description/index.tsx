import { LabelWithTooltipDisplay } from "@app/_shared"
import { FormikContext } from "../../../../_components/FormikProviders"
import React, { useContext } from "react"
import utils from "@utils"
import { SwapContext } from "../../../../_hooks"

const Description = () => {
    const { swapState } = useContext(SwapContext)!
    const formik = useContext(FormikContext)!

    const renderMinimunReceived = (): number => {
        const amount= utils.math
            .computeSlippage(formik.values.amountOutRaw, formik.values.slippage, true)
        console.log(amount)
        return utils.math.computeRedenomination(
            amount,
            swapState.infoOut.decimals
        )
    }

    const renderPriceImpact = (): string => {
        const amountInRaw = utils.math.computeDeRedenomination(
            utils.format.parseNumber(formik.values.amountIn),
            swapState.infoOut.decimals
        )
        const amountOutRaw = utils.math.computeDeRedenomination(
            utils.format.parseNumber(formik.values.amountOut),
            swapState.infoOut.decimals
        )

        const actualRatio = utils.math.computeBigIntDivideBigInt(
            amountInRaw,
            amountOutRaw
        )

        const baseRatio = formik.values.price

        return `${utils.math.computePriceImpact(actualRatio, baseRatio)}%`
    }
    return (
        <div className="w-full flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <LabelWithTooltipDisplay text="Minimun received" tooltipContent="AAA" />
                <div className="text-sm"> {renderMinimunReceived()} </div>
            </div>
            <div className="flex justify-between items-center">
                <LabelWithTooltipDisplay text="Price impact" tooltipContent="AAA" />
                <div className="text-sm text-danger"> {renderPriceImpact()} </div>
            </div>
        </div>
    )
}

export default Description
