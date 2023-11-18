"use client"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import { Image } from "@nextui-org/react"
import React from "react"
import { Address } from "web3"

interface NFTCardProps {
  data: {
    tokenId: bigint;
    name: string;
    author: Address;
    collection: string;
    description: string;
    imageBlobUrl: string;
    tags: string[];
    externalUrl: string;
  };
}
const NFTCard = (props: NFTCardProps) => {
    return (
        <Card isPressable>
            <Image
                shadow="sm"
                radius="none"
                width="100%"
                alt={props.data.imageBlobUrl}
                className="w-full"
                src={props.data.imageBlobUrl}
            />
            <CardBody className="p-4">
                <div className="flex justify-between">
                    <div className="text-lg font-bold"> {props.data.name}</div>
                    <div className="text-lg text-teal-500"> #{Number(props.data.tokenId)}</div>
                </div>

                <Spacer y={6}/>
                <div className="flex justify-between text-sm">
                    <div>
                        <div> Floor </div>
                        <div className="font-bold"> 5 STARCI </div>
                    </div>
                    <div>
                        <div> Total Volume </div>
                        <div className="font-bold"> 123 STARCI </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default NFTCard
