"use client"
import { Spacer } from "@nextui-org/react"
import React, { useContext } from "react"
import SelectToken from "./SelectToken"
import { TitleDisplay } from "@app/_shared"
import { PlusIcon } from "@heroicons/react/24/outline"
import { FormikPropsContext } from "../formik"

interface SelectTokenPairProps {
    className?: string
}

const SelectTokenPair = (props: SelectTokenPairProps) => {
    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    return (
        <div className = {props.className}>
            <TitleDisplay title="Select Token" />
            <Spacer y={4} />
            <div className="flex items-center gap-4">
                <SelectToken otherTokenAddress={formik.values.token1Address} className="grow" />
                <PlusIcon width={24} height={24} />
                <SelectToken otherTokenAddress={formik.values.token0Address} isToken1Select className="grow" />
            </div>
        </div>
    )
}

export default SelectTokenPair
