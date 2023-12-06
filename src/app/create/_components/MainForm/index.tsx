"use client"
import { Card, CardBody, CardHeader, Divider, Spacer } from "@nextui-org/react"
import React, { createContext, useMemo, useState } from "react"
import FormikProviders from "./FormikPropsContext"
import { AppButton } from "@app/_shared"
import SelectTokenPair from "./SelectTokenPair"
import PickProtocolFee from "./PickProtocolFee"
import AddTokens from "./AddTokens"
import ChooseTokenPrices from "./ChooseTokenPrices"

interface IFinishSelectPairContext {
  finishSelectPair: boolean;
  setFinishSelectPair: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FinishSelectPairContext =
  createContext<IFinishSelectPairContext | null>(null)

const MainForm = () => {
    const [finishSelectPair, setFinishSelectPair] = useState(false)

    const contextValue = useMemo(() => {
        return { finishSelectPair, setFinishSelectPair }
    }, [finishSelectPair, setFinishSelectPair])
    
    return (
        <Card>
            <CardHeader className="p-5">
                <div className="font-bold text-lg">Create Pool</div>
            </CardHeader>
            <Divider />
            <CardBody className="p-5">
                <FormikProviders>
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-12">
                        <FinishSelectPairContext.Provider value={contextValue}>
                            <div>
                                <SelectTokenPair />
                                <Spacer y={12} />
                                <PickProtocolFee />
                                <Spacer y={12} />
                                <AddTokens />
                            </div>
                            <div className="justify-between flex flex-col">
                                <ChooseTokenPrices />
                                <Spacer y={12} />
                                <AppButton typeSubmit content="Create" />
                            </div>
                        </FinishSelectPairContext.Provider>
                    </div>
                </FormikProviders>
            </CardBody>
        </Card>
    )
}

export default MainForm
