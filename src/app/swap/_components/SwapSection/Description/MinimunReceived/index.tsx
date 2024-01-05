import { LabelWithTooltipDisplay } from "@app/_shared"
import React, { useContext, useEffect, useRef, useState } from "react"
import utils from "@utils"
import { SwapContext, FormikContext, SLIPPAGE_DEFAULT } from "../../../../_hooks"

const MinimunReceived = () => {
    const { swapState } = useContext(SwapContext)!
    const formik = useContext(FormikContext)!

    const [amountInRawTemp, setAmountInRawTemp] = useState(BigInt(0))
    const [amountOutRawTemp, setAmountOutRawTemp] = useState(BigInt(0))

    useEffect(() => {
        setAmountInRawTemp(formik.values.amountInRaw)
        setAmountOutRawTemp(formik.values.amountOutRaw)
    }, [])

    const [receivedMin, setReceivedMin] = useState(0)

    const receivedMinHasMountedRef = useRef(false)
    useEffect(() => {
        if (!receivedMinHasMountedRef.current) {
            receivedMinHasMountedRef.current = true
        }

        if (!swapState.status.finishLoadBeforeConnectWallet) return

        if (
            formik.values.amountInRaw === amountInRawTemp ||
      formik.values.amountOutRaw === amountOutRawTemp
        )
            return
            
        const receivedMinRaw = utils.math.computeSlippage(
            formik.values.amountOutRaw,
            utils.format.parseStringToNumber(formik.values.slippage, SLIPPAGE_DEFAULT)
        )

        setReceivedMin(
            utils.math.computeRedenomination(
                receivedMinRaw,
                swapState.infoOut.decimals
            )
        )

        setAmountInRawTemp(formik.values.amountInRaw)
        setAmountOutRawTemp(formik.values.amountOutRaw)
    }, [
        formik.values.amountInRaw,
        formik.values.amountOutRaw,
        swapState.status.finishLoadBeforeConnectWallet
    ])

    console.log(formik.values)
    return (
        <div className="flex justify-between items-center">
            <LabelWithTooltipDisplay text="Minimun received" tooltipContent="AAA" />
            <div className="text-sm"> {receivedMin} </div>
        </div>
    )
}

export default MinimunReceived
