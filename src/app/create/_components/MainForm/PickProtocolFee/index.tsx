"use client"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import React, { useContext } from "react"
import { TitleDisplay } from "@app/_shared"
import { FormikPropsContext } from "../formik"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { FinishSelectPairContext } from "../index"

interface PickProtocolFeeProps {
  className?: string;
}

interface ProtocolFee {
  key: number;
  label: string;
  value: number;
}

const protocolFees: ProtocolFee[] = [
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

const PickProtocolFee = (props: PickProtocolFeeProps) => {
    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const darkMode = useSelector((state: RootState) => state.configuration.darkMode)

    const account = useSelector((state: RootState) => state.blockchain.account)

    const finishSelectPairContext = useContext(FinishSelectPairContext)
    if (finishSelectPairContext == null) return

    const { finishSelectPair } = finishSelectPairContext

    const _click = (fee: ProtocolFee) => {
        formik.setFieldValue("_protocolFeeId", fee.key)
        formik.setFieldValue("protocolFee", fee.value)
    }

    const _renderIfSelected = (key: number) => {
        if (formik.values._protocolFeeId == key){
            return `bg-teal-500 ${darkMode ? "text-black" : "text-white"}`
        } else {
            return ""
        }
    }

    const _finishSelectPair = account != null && finishSelectPair

    return (
        <div className={props.className}>
            <TitleDisplay title="Pick Protocol Fee" />
            <Spacer y={4} />
            <div className="grid grid-cols-4 gap-4">
                {protocolFees.map((fee) => (
                    <Card
                        key={fee.key}
                        onPress={() => _click(fee)}
                        isPressable = {_finishSelectPair}
                        className={`${_renderIfSelected(fee.key)} glow`}
                    >
                        <CardBody className="p-5">
                            <span className="font-bold text-center">{fee.label}</span>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default PickProtocolFee
