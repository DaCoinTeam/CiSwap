"use client"
import { Card, CardBody, CardHeader, Divider, Spacer } from "@nextui-org/react"
import React, { createContext, useState } from "react"
import FormikProviders from "./formik"
import { AppButton } from "@app/_shared"
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
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-12">
                        <FinishSelectPairContext.Provider value={{ finishSelectPair, setFinishSelectPair}}>
                            <div>
                                <SelectTokenPair/>
                                <Spacer y={12}/>
                                <PickProtocolFee />
                                <Spacer y={12}/>
                                <AddTokens />
                            </div>
                            <div className="justify-between flex flex-col">
                                <ChooseTokenPrices />
                                <Spacer y={12}/>
                                <AppButton darkMode={darkMode} typeSubmit content="Create" />
                            </div>
                        </FinishSelectPairContext.Provider>
                    </div>
                </FormikProviders>
            </CardBody>
        </Card>
    )
}

export default MainForm
