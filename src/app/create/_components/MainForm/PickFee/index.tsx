"use client"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import React, { useContext } from "react"
import { TitleDisplay } from "@app/_shared"
import { FormikContext } from "../FormikContext"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { FinishSelectedPairContext } from "../index"

interface PickFeeProps {
  className?: string;
}

interface Item {
  key: number;
  label: string;
  value: number;
}

const items: Item[] = [
    {
        key: 0,
        label: "0.25%",
        value: 0.0025,
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
        label: "2.5%",
        value: 0.025,
    },
]

const PickFee = (props: PickFeeProps) => {
    const formik = useContext(FormikContext)!

    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )

    const account = useSelector((state: RootState) => state.blockchain.account)

    const { finishSelectedPair } = useContext(FinishSelectedPairContext)!

    const onClick = (item: Item) => {
        formik.setFieldValue("feeKey", item.key)
        formik.setFieldValue("fee", item.value)
    }

    const renderSelected = (key: number) =>
    {   
        const textColor = darkMode ? "text-black" : "text-white"
        formik.values.feeKey === key
            ? `bg-teal-500 ${textColor}`
            : null
    }
  
    const _finishSelectedPair = account != null && finishSelectedPair

    return (
        <div className={props.className}>
            <TitleDisplay text="Pick Fee" />
            <Spacer y={4} />
            <div className={`grid grid-cols-${items.length} gap-4`}>
                {items.map((item) => (
                    <Card
                        key={item.key}
                        onPress={() => onClick(item)}
                        isPressable={_finishSelectedPair}
                        className={`${renderSelected(item.key)} glow`}
                    >
                        <CardBody className="p-5">
                            <span className="font-bold text-center">{item.label}</span>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default PickFee
