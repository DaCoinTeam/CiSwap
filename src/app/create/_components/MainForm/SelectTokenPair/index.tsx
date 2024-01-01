"use client"
import { Spacer } from "@nextui-org/react"
import React, { useContext } from "react"
import SelectToken from "./SelectToken"
import { TitleDisplay } from "@app/_shared"
import { PlusIcon } from "@heroicons/react/24/outline"
import { FormikContext } from "../FormikContext"

interface SelectTokenPairProps {
    className?: string
}

const SelectTokenPair = (props: SelectTokenPairProps) => {
    const formik = useContext(FormikContext)!

    return (
        <div className = {props.className}>
            <TitleDisplay title="Select Token" />
            <Spacer y={4} />
            <div className="flex items-center gap-4">
                <SelectToken otherToken={formik.values.tokenB} className="flex-1" />
                <PlusIcon width={24} height={24} />
                <SelectToken otherToken={formik.values.tokenA} isTokenBSelected className="flex-1" />
            </div>
        </div>
    )
}

export default SelectTokenPair
