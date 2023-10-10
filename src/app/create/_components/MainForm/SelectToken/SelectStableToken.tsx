"use client"
import { TitleDisplay } from "@app/_shared"
import {
    Card,
    CardBody,
    CardFooter,
    Skeleton,
    Spacer,
} from "@nextui-org/react"
import React, { useEffect, useState } from "react"
import { ERC20Contract, chainInfos } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "../../../../../redux/store"

interface SelectStableTokenProps {
  className?: string;
  finishLoad?: boolean;
}

const SelectStableToken = (props: SelectStableTokenProps) => {
    const chainName = useSelector((state: RootState) => state.blockchain.chainName)
    
    useEffect(() => {
        const handleEffect = async () => {
            const stableTokens = chainInfos[chainName].stableTokenAddresses

            for (const token of stableTokens){
                const contract = new ERC20Contract(
                    chainName,
                    token
                )
                const symbol = await contract.symbol()
                console.log(symbol)
            }
        }
        handleEffect()
    }, [])
    
    return (
        <div>
            <TitleDisplay title="Stable Tokens" />
            <Spacer y={4} />
            <div className="flex gap-4">
                {props.finishLoad ? (
                    <CardBody className="p-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <Spacer y={4}/>
                        <Skeleton className="w-12 h-5 rounded" />
                    </CardBody>
                ) : (
                    [0, 1].map((key) => (
                        <Card key={key} className="col-span-1">
                            <CardBody className="p-4">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <Spacer y={4}/>
                                <Skeleton className="w-12 h-5 rounded" />
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

export default SelectStableToken
