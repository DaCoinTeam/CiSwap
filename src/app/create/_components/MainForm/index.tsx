"use client"
import { Card, CardBody, CardHeader, Divider, Spacer } from "@nextui-org/react"
import React, { createContext, useMemo, useState } from "react"
import FormikProviders from "./FormikPropsContext"
import { AppButton } from "@app/_shared"
import SelectTokenPair from "./SelectTokenPair"
import PickFee from "./PickFee"
import AddTokens from "./DepositTokens"
import ChooseTokenPrices from "./ChooseTokenPrices"

interface IFinishSelectedPairContext {
  finishSelectedPair: boolean;
  setFinishSelectedPair: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FinishSelectedPairContext =
  createContext<IFinishSelectedPairContext | null>(null)

const MainForm = () => {
    const [finishSelectedPair, setFinishSelectedPair] = useState(false)

    const contextValue = useMemo(() => {
        return { finishSelectedPair, setFinishSelectedPair }
    }, [finishSelectedPair, setFinishSelectedPair])
    
    return (
        <Card>
            <CardHeader className="p-5">
                <div className="font-bold text-lg">Create Pool</div>
            </CardHeader>
            <Divider />
            <CardBody className="p-5">
                <FormikProviders>
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-12">
                        <FinishSelectedPairContext.Provider value={contextValue}>
                            <div>
                                <SelectTokenPair />
                                <Spacer y={12} />
                                <PickFee />
                                <Spacer y={12} />
                                <AddTokens />
                            </div>
                            <div className="justify-between flex flex-col">
                                <ChooseTokenPrices />
                                <Spacer y={12} />
                                <AppButton typeSubmit content="Create" />
                            </div>
                        </FinishSelectedPairContext.Provider>
                    </div>
                </FormikProviders>
            </CardBody>
        </Card>
    )
}

export default MainForm
