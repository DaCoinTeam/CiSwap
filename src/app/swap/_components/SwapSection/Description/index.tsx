import { LabelWithTooltipDisplay } from "@app/_shared"
import { FormikContext } from "../../FormikProviders"
import React, { useContext, useEffect, useRef, useState } from "react"
import utils from "@utils"
import { SwapContext } from "../../../_hooks"
import Route from "./Route"

const Description = () => {
    const { swapState } = useContext(SwapContext)!
    const formik = useContext(FormikContext)!

    const [receivedMin, setReceivedMin] = useState(0)
    const [priceImpact, setPriceImpact] = useState(0)

    const executeHasMountedRef = useRef(false)
    useEffect(() => {
        if (!executeHasMountedRef.current) {
            executeHasMountedRef.current = true
        }

        if (!formik.values.finishExecuteIn || !formik.values.finishExecuteOut)
            return

        const amountSlippaged = utils.math.computeSlippage(
            formik.values.amountOutRaw,
            utils.format.parseStringToNumber(formik.values.slippage, 0.02),
            true
        )
        setReceivedMin(
            utils.math.computeRedenomination(
                amountSlippaged,
                swapState.infoOut.decimals
            )
        )

        const actualRatio = utils.math.computeBigIntDivideBigInt(
            formik.values.amountInRaw,
            formik.values.amountOutRaw
        )

        const baseRatio = formik.values.price
        setPriceImpact(utils.math.computePriceImpact(actualRatio, baseRatio))
    }, [formik.values.finishExecuteIn, formik.values.finishExecuteOut])

    return (
        <div className="w-full flex flex-col gap-1">
            {/* <div className="flex justify-between items-center">
                <LabelWithTooltipDisplay
                    text="Slippage tolerance"
                    tooltipContent="AAA"
                />
                <div className="text-sm">
                    {" "}
                    {utils.format.parseStringToNumberMultiply(
                        formik.values.slippage,
                        100,
                        SLIPPAGE_DEFAULT
                    )}
          %{" "}
                </div>
            </div> */}
            <div className="flex justify-between items-center">
                <LabelWithTooltipDisplay text="Minimun received" tooltipContent="AAA" />
                <div className="text-sm"> {receivedMin} </div>
            </div>
            <div className="flex justify-between items-center">
                <LabelWithTooltipDisplay text="Price impact" tooltipContent="AAA" />
                <div className="text-sm text-danger"> {priceImpact}% </div>
            </div>
            <Route />
        </div>
    )
}

export default Description
