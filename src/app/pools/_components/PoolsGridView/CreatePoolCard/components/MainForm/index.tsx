"use client"
import { Spacer } from "@nextui-org/react"
import React, { createContext, useMemo, useState } from "react"
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
                    <AppButton submit text="Create" />
                </div>
            </FinishSelectedPairContext.Provider>
        </div>
    )
}

export default MainForm
