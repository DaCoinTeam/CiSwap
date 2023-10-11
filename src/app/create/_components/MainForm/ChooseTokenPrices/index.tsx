"use client"
import React, { useContext } from "react"
import { TitleDisplay } from "@app/_shared"
import { Button, Card, CardBody, CardHeader, Input, Select, Spacer } from "@nextui-org/react"
import { MinusCircleIcon } from "@heroicons/react/24/outline"
import { MinusIcon, MinusSmallIcon, PlusCircleIcon, PlusIcon, PlusSmallIcon } from "@heroicons/react/24/solid"
import { RootState } from "@redux"
import { FinishSelectPairContext } from "../index"
import { FormikPropsContext } from "../formik"
import { useSelector } from "react-redux"

interface ChooseTokenPricesProps {
    className?: string
}

const ChooseTokenPrices = (props: ChooseTokenPricesProps) => {
    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const darkMode = useSelector((state: RootState) => state.configuration.darkMode)

    const web3 = useSelector((state: RootState) => state.blockchain.web3)

    const finishSelectPairContext = useContext(FinishSelectPairContext)
    if (finishSelectPairContext == null) return

    const { finishSelectPair } = finishSelectPairContext

    const _finishSelectPair = web3 != null && finishSelectPair
    return (
        <div className = {`${props.className}`}>
            <TitleDisplay title="Choose Token Prices" />
            <Spacer y={4} />
            <div className="flex gap-4">
                <Card className="grow">
                    <CardBody>
                        <div className="text-center w-full font-bold text-sm">
                        Base Price
                        </div>
                        <Spacer y={6}/>
                        <div className="flex gap-4 items-center">
                            <Button variant="flat" isIconOnly endContent={<MinusIcon height={12} width={12}/>} className="w-5 h-5 min-w-0 flex-none" radius="full"/> 
                            <Input labelPlacement="outside"/>
                            <Button variant="flat" isIconOnly endContent={<PlusIcon height={12} width={12}/>} className="w-5 h-5 min-w-0 flex-none" radius="full"/> 
                        </div>
                        <Spacer y={6}/>
                        <div className="font-bold text-center"> 5 USDT = 1 </div>
                    </CardBody>
                </Card>
                <Card className="grow">
                    <CardBody>
                        <div className="text-center w-full font-bold text-sm">
                        Max Price
                        </div>
                        <Spacer y={6}/>
                        <div className="flex gap-4 items-center">
                            <Button variant="flat" isIconOnly endContent={<MinusIcon height={12} width={12}/>} className="w-5 h-5 min-w-0 flex-none" radius="full"/> 
                            <Input labelPlacement="outside"/>
                            <Button variant="flat" isIconOnly endContent={<PlusIcon height={12} width={12}/>} className="w-5 h-5 min-w-0 flex-none" radius="full"/> 
                        </div>
                        <Spacer y={6}/>
                        <div className="font-bold text-center"> 5 USDT = 1 </div>
                    </CardBody>
                </Card>
            
            </div>
        </div>
    )
}
export default ChooseTokenPrices