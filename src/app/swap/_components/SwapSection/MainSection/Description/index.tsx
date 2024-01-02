import { LabelWithTooltipDisplay } from "@app/_shared"
import { FormikContext } from "../../../../_components/FormikProviders"
import React, { useContext, useEffect, useState } from "react"
import utils from "@utils"
import { SwapContext } from "../../../../_hooks"

const Description = () => {
    const { swapState } = useContext(SwapContext)!
    const formik = useContext(FormikContext)!

    const [amountInRawTemp, setAmountInRawTemp] = useState(BigInt(0))
    const [amountOutRawTemp, setAmountOutRawTemp] = useState(BigInt(0))

    const [receivedMin, setReceivedMin] = useState(0)
    const [priceImpact, setPriceImpact] = useState(0)

    useEffect(() => {
        setAmountInRawTemp(formik.values.amountInRaw)
        setAmountOutRawTemp(formik.values.amountOutRaw)
    }, [])

    useEffect(() => {
        if (
            formik.values.amountInRaw == amountInRawTemp ||
      formik.values.amountOutRaw == amountOutRawTemp
        )
            return
        
        setAmountInRawTemp(formik.values.amountInRaw)
        setAmountOutRawTemp(formik.values.amountOutRaw)

        const amountSlippaged = utils.math.computeSlippage(
            formik.values.amountOutRaw,
            formik.values.slippage,
            true
        )
        setReceivedMin(
            utils.math.computeRedenomination(amountSlippaged, swapState.infoOut.decimals)
        )

        const actualRatio = utils.math.computeBigIntDivideBigInt(
            formik.values.amountInRaw,
            formik.values.amountOutRaw
        )

        const baseRatio = formik.values.price
        setPriceImpact(utils.math.computePriceImpact(actualRatio, baseRatio))
    
    }, [formik.values.amountInRaw, formik.values.amountOutRaw])
  

    return (
        <div className="w-full flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <LabelWithTooltipDisplay text="Minimun received" tooltipContent="AAA" />
                <div className="text-sm"> {receivedMin} </div>
            </div>
            <div className="flex justify-between items-center">
                <LabelWithTooltipDisplay text="Price impact" tooltipContent="AAA" />
                <div className="text-sm text-danger"> {priceImpact}% </div>
            </div>
        </div>
    )
}

export default Description
