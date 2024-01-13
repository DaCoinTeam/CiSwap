import { NumberInput, TitleDisplay } from "@app/_shared"
import { Button } from "@nextui-org/react"
import { FormikContext } from "../../../../../_hooks"
import React, { useContext } from "react"
import { format } from "@utils"
import { useSelector } from "react-redux"
import { RootState } from "../../../../../../../redux/store"

interface Item {
  key: number;
  label?: string;
  value?: number;
  isPressable?: boolean;
}

const SlippageTolerance = () => {
    const formik = useContext(FormikContext)!
    const darkMode = useSelector((state: RootState) => state.configuration.darkMode)

    const items: Item[] = [
        {
            key: 0,
            label: "0.1%",
            value: 0.001,
        },
        {
            key: 1,
            label: "0.5%",
            value: 0.005,
        },
        {
            key: 2,
            label: "1%",
            value: 0.01,
        },
        {
            key: 3,
        },
    ]

    const renderSelected = (key: number) =>
    {   
        const textColor = darkMode ? "text-black" : "text-white"
        return formik.values.slippageKey === key
            ? `bg-teal-500 ${textColor}`
            : null
    }


    const onClick = (item: Item) => {
        formik.setFieldValue("slippageKey", item.key)
        formik.setFieldValue("slippage", item.value)
    }

    const onChange = (valueMul100: string) => {
        formik.setFieldValue(
            "slippage",
            format.parseStringToNumberMultiply(valueMul100, 1 / 100)
        )
    }

    const textColor = darkMode ? "text-black" : "text-white"

    return (
        <div className="flex flex-col gap-6">
            <TitleDisplay text="Slippage tolerance" tooltipText="AAA" />
            <div className={"flex gap-4"}>
                {items.map((item) => {
                    if (item.key != items.length - 1)
                        return (
                            <Button
                                key={item.key}
                                variant="flat"
                                className={`${renderSelected(item.key)} glow w-[5rem]`}
                                onPress={() => onClick(item)}
                            >
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
                            </Button>
                        )

                    return (
                        <NumberInput
                            key={item.key}
                            value={format.parseStringToNumberMultiply(
                                formik.values.slippage,
                                100
                            )}
                            variant="bordered"
                            radius="md"
                            className="w-[5rem]"
                            onChange={onChange}
                            endContent="%"
                            placeholder={"2.0"}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default SlippageTolerance
