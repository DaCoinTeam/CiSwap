"use client"
import { LabelWithTooltipDisplay } from "@app/_shared"
import React, { useContext, useEffect, useState } from "react"
import { FormikContext } from "../../../../_hooks"
import { ERC20Contract } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import {
    ChevronRightIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import { Button, Skeleton } from "@nextui-org/react"

const Route = () => {
    const formik = useContext(FormikContext)!
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const [elements, setElements] = useState<JSX.Element[]>([])

    const [finishLoad, setFinishLoad] = useState(false)

    useEffect(() => {
        if (!formik.values.steps.length) {
            setFinishLoad(false)
            return
        }
        const handleEffect = async () => {
            try {
                const elementsUpdated: JSX.Element[] = []
                let key = 0
                for (const step of formik.values.steps) {
                    if (typeof step === "string") {
                        const tokenContract = new ERC20Contract(chainId, step)
                        const symbol = await tokenContract.symbol()
                        if (symbol == null) return
                        elementsUpdated.push(
                            <span key={key++} className="text-sm">
                                {symbol}
                            </span>
                        )
                        continue
                    }

                    elementsUpdated.push(
                        <ChevronRightIcon key={key++} className="w-3.5 h-3.5" />
                    )
                }
                setElements(elementsUpdated)
            } finally {
                setFinishLoad(true)
            }
        }
        handleEffect()
    }, [formik.values.steps])

    console.log(finishLoad)

    return (
        <div className="flex justify-between items-center">
            <LabelWithTooltipDisplay text="Route" tooltipContent="AAA" />
            {finishLoad ? (
                <div className="flex gap-1">
                    <div className="flex items-center gap-0.5">{elements}</div>
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => {}}
                        radius="full"
                        className="min-w-0 flex-none w-5 h-5"
                    >
                        <MagnifyingGlassIcon className="w-3.5 h-3.5" />
                    </Button>
                </div>
            ) : (
                <Skeleton className="h-5 w-20 rounded" />
            )}
        </div>
    )
}

export default Route
