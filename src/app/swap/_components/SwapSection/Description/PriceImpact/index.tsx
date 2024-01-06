import { LabelWithTooltipDisplay } from "@app/_shared"
import React, { useContext, useEffect, useRef, useState } from "react"
import utils from "@utils"
import { SwapContext, FormikContext } from "../../../../_hooks"

const PriceImpact = () => {
    const { swapState } = useContext(SwapContext)!
    const formik = useContext(FormikContext)!

    const [amountInRawTemp, setAmountInRawTemp] = useState(BigInt(0))
    const [amountOutRawTemp, setAmountOutRawTemp] = useState(BigInt(0))

    useEffect(() => {
        setAmountInRawTemp(formik.values.amountInRaw)
        setAmountOutRawTemp(formik.values.amountOutRaw)
    }, [])

    const [priceImpact, setPriceImpact] = useState(0)

    const receivedMinHasMountedRef = useRef(false)
    useEffect(() => {
        if (!receivedMinHasMountedRef.current) {
            receivedMinHasMountedRef.current = true
        }

        if (!swapState.status.finishLoadBeforeConnectWallet) return

        if (!formik.values.price) return

        if (
            formik.values.amountInRaw === amountInRawTemp ||
      formik.values.amountOutRaw === amountOutRawTemp
        )
            return

        const priceBefore = formik.values.price
        console.log("bf" + priceBefore)

        const priceAfter = utils.math.computeBigIntDivideBigInt(
            formik.values.amountInRaw,
            formik.values.amountOutRaw
        )
        console.log("af" + priceAfter)

        const priceImpact = utils.math.computePriceImpact(priceAfter, priceBefore)
        if (!priceImpact) return
        setPriceImpact(priceImpact.percentage)

        setAmountInRawTemp(formik.values.amountInRaw)
        setAmountOutRawTemp(formik.values.amountOutRaw)
    }, [
        formik.values.amountInRaw,
        formik.values.amountOutRaw,
        swapState.status.finishLoadBeforeConnectWallet,
        formik.values.price,
    ])

    return (
        <div className="flex justify-between items-center">
            <LabelWithTooltipDisplay text="Price impact" tooltipContent="AAA" />
            <div className="text-sm text-danger"> {priceImpact}% </div>
        </div>
    )
}

export default PriceImpact
