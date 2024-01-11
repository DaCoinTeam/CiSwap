import { NumberInput, TitleDisplay } from "@app/_shared"
import { FormikContext } from "../../../../../_hooks"
import React, { useContext } from "react"
import { format } from "@utils"

const TxDeadline = () => {
    const formik = useContext(FormikContext)!
    const onChange = (valueMul100: string) => {
        formik.setFieldValue(
            "txDeadline",
            format.parseStringToNumberMultiply(valueMul100, 1 / 30)
        )
    }

    return (
        <div className="flex justify-between items-center">
            <TitleDisplay text="Tx txDeadline (mins)" tooltipText="AAA" />
            <NumberInput
                value={format.parseStringToNumberMultiply(
                    formik.values.txDeadline,
                    30
                )}
                className="w-[3rem]"
                variant="bordered"
                onChange={onChange}
                placeholder="30"
            />
        </div>
    )
}
export default TxDeadline
