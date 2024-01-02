import { NumberInput, TitleDisplay } from "@app/_shared"
import { FormikContext } from "../../../../FormikProviders"
import utils from "@utils"
import React, { useContext } from "react"
import { Card } from "@nextui-org/react"
const TxDeadline = () => {
    const formik = useContext(FormikContext)!
    const onChange = (valueMul100: string) => {
        formik.setFieldValue(
            "txDeadline",
            utils.format.parseStringToNumberMultiply(valueMul100, 1 / 30)
        )
    }

    return (
        <div className="flex justify-between items-center grid grid-cols-4 gap-4">
            <TitleDisplay className="col-span-3" text="Tx deadline (mins)" tooltipText="AAA" />
            <Card shadow="sm" className="col-span-1">
                <NumberInput
                    value={utils.format.parseStringToNumberMultiply(
                        formik.values.txDeadline,
                        30
                    )}
                    onChange={onChange}
                    placeholder="30"
                />
            </Card>
        </div>
    )
}
export default TxDeadline
