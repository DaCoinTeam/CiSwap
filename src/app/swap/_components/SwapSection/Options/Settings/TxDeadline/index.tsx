import { NumberInput, TitleDisplay } from "@app/_shared"
import { FormikContext } from "../../../../FormikProviders"
import utils from "@utils"
import React, { useContext } from "react"

const TxDeadline = () => {
    const formik = useContext(FormikContext)!
    const onChange = (valueMul100: string) => {
        formik.setFieldValue(
            "deadline",
            utils.format.parseStringToNumberMultiply(valueMul100, 1 / 30)
        )
    }

    return (
        <div className="flex justify-between items-center">
            <TitleDisplay text="Tx deadline (mins)" tooltipText="AAA" />
            <NumberInput
                value={utils.format.parseStringToNumberMultiply(
                    formik.values.deadline,
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
