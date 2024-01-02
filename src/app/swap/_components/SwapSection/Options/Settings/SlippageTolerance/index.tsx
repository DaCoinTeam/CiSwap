import { NumberInput, TitleDisplay } from "@app/_shared"
import { Card, CardBody } from "@nextui-org/react"
import { RootState } from "@redux"
import { FormikContext } from "../../../../../_components/FormikProviders"
import React, { useContext } from "react"
import { useSelector } from "react-redux"
import utils from "@utils"

interface Item {
  key: number;
  label?: string;
  value?: number;
  isPressable?: boolean;
}

const SlippageTolerance = () => {
    const formik = useContext(FormikContext)!
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )

    const items: Item[] = [
        {
            key: 0,
            label: "0.1%",
            value: 0.001,
            isPressable: true,
        },
        {
            key: 1,
            label: "0.5%",
            value: 0.005,
            isPressable: true,
        },
        {
            key: 2,
            label: "1%",
            value: 0.01,
            isPressable: true,
        },
        {
            key: 3,
        },
    ]

    const renderSelected = (key: number) =>
        formik.values.slippageKey === key
            ? `bg-teal-500 ${darkMode ? "text-black" : "text-white"}`
            : null

    const onClick = (item: Item) => {
        formik.setFieldValue("slippageKey", item.key)
        formik.setFieldValue("slippage", item.value)
    }

    const onChange = (valueMul100: string) => {
        formik.setFieldValue(
            "slippage",
            utils.format.parseStringToNumberMultiply(valueMul100, 1 / 100)
        )
    }

    const textColor = darkMode ? "text-black" : "text-white"

    return (
        <div className="flex flex-col gap-6">
            <TitleDisplay text="Slippage tolerance" tooltipText="AAA" />
            <div className={`grid grid-cols-${items.length} gap-4`}>
                {items.map((item) => (
                    <Card
                        shadow="sm"
                        key={item.key}
                        isPressable={item.isPressable}
                        className={`${renderSelected(item.key)} glow`}
                        onPress={() => onClick(item)}
                    >
                        <CardBody className="p-0">
                            {item.isPressable ? (
                                <div
                                    className={`h-full grid place-items-center 
                                    font-bold 
                                    ${
                                item.key === formik.values.slippageKey
                                    ? textColor
                                    : null
                                }`}
                                >
                                    {item.label}
                                </div>
                            ) : (
                                <NumberInput
                                    value={utils.format.parseStringToNumberMultiply(
                                        formik.values.slippage,
                                        100
                                    )}
                                    onChange={onChange}
                                    endContent="%"
                                    placeholder={"2.0"}
                                />
                            )}
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default SlippageTolerance
