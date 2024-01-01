"use client"
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import React, { createContext } from "react"
import FormikProviders from "./FormikProviders"
import UploadImage from "./UploadImage"
import InputFields from "./InputFields"
import { AppButton } from "@app/_shared"

interface IFinishSelectedPairContext {
  finishSelectedPair: boolean;
  setFinishSelectedPair: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FinishSelectedPairContext =
  createContext<IFinishSelectedPairContext | null>(null)

const MainForm = () => {
    return (
        <Card>
            <CardHeader className="p-5">
                <div className="font-bold text-lg">Create NFT</div>
            </CardHeader>
            <Divider />
            <CardBody>
                <FormikProviders>
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-12">
                        <UploadImage />
                        <div className="flex flex-col justify-between gap-6">
                            <InputFields />
                            <AppButton className="w-full" submit text="Create" />
                        </div>

                    </div>
                </FormikProviders>
            </CardBody>
        </Card>
    )
}

export default MainForm
