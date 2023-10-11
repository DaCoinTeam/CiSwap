"use client"
import { Card, CardBody, CardHeader, Divider, Spacer } from "@nextui-org/react"
import React, { createContext, useState } from "react"
import FormikProviders from "./formik"
import { AppButton } from "@app/_shared"
import { Form } from "formik"
import SelectTokenPair from "./SelectTokenPair"
import PickProtocolFee from "./PickProtocolFee"
import AddTokens from "./AddTokens"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import ChooseTokenPrices from "./ChooseTokenPrices"

interface IFinishSelectPairContext {
    finishSelectPair: boolean 
    setFinishSelectPair: React.Dispatch<React.SetStateAction<boolean>>
}

export const FinishSelectPairContext = createContext<IFinishSelectPairContext | null>(null)

const MainForm = () => {
    const darkMode = useSelector((state: RootState) => state.configuration.darkMode)
    const [finishSelectPair, setFinishSelectPair] = useState(false)

    return (
        <Card>
            <CardHeader className="p-5">
                <div className="font-bold text-lg">Create Liquidity Pool</div>
            </CardHeader>
            <Divider />
            <CardBody>
                <FormikProviders>
                    {(
                        <Form>
                            <div className="grid sm:grid-cols-2 grid-cols-1 gap-12">
                                <div>
                                    <FinishSelectPairContext.Provider value={{ finishSelectPair, setFinishSelectPair}}>
                                        <SelectTokenPair/>
                                        <Spacer y={12}/>
                                        <PickProtocolFee />
                                        <Spacer y={12}/>
                                        <AddTokens />
                                    </FinishSelectPairContext.Provider>
                                </div>
                                <div className="justify-between flex flex-col">
                                    <ChooseTokenPrices />
                                    <Spacer y={12}/>
                                    <AppButton darkMode={darkMode} size="lg" type="submit" content="Create" />
                                </div>
                            </div>
                        </Form>
                    )}
                </FormikProviders>
            </CardBody>
        </Card>
    )
}

export default MainForm
