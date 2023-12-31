"use client"
import React, { useEffect, useState } from "react"
import { ERC721Contract } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { chainInfos } from "@config"
import { getIpfsImageBlobUrl, getIpfsJson } from "../../api/next"
import { NFTURI } from "./create/_components/MainForm/FormikProviders"
import { NFTCard } from "./_components"
import { Address } from "web3"

const Page = () => {
    const chainId = useSelector(
        (state: RootState) => state.blockchain.chainId
    )
    const [NFTDatas, setNFTDatas] = useState<NFTData[]>([])

    useEffect(() => {
        const handleEffect = async () => {
            const erc721Contract = new ERC721Contract(
                chainId,
                chainInfos[chainId].NFTAddress
            )
            const numNFTs = await erc721Contract.numNFTs()
            if (numNFTs === null) return

            const cids: string[] = []
            const cidPromises: Promise<void>[] = []
            for (let i: bigint = BigInt(0); i < numNFTs; i++) {
                const cidPromise = erc721Contract.tokenURI(i).then((cid) => {
                    if (cid === null) return
                    cids.push(cid)
                })
                cidPromises.push(cidPromise)
            }
            await Promise.all(cidPromises)

            const NFTDatas: NFTData[] = []
            const NFTDataPromises: Promise<void>[] = []
            for (let i: bigint = BigInt(0); i < numNFTs; i++) {
                const NFTDataPromise = getIpfsJson(cids[Number(i)]).then(
                    async (uri) => {
                        if (uri === null) return
                        const _uri = uri as NFTURI

                        const imageBlobUrl = await getIpfsImageBlobUrl(_uri.imageCid)
                        if (imageBlobUrl === null) return

                        const data: NFTData = {
                            tokenId: i,
                            author: _uri.author,
                            collection: _uri.collection,
                            floor: _uri.floor,
                            description: _uri.description,
                            externalUrl: _uri.externalUrl,
                            imageBlobUrl,
                            name: _uri.name,
                            tags: _uri.tags,
                        }

                        NFTDatas.push(data)
                    }
                )
                NFTDataPromises.push(NFTDataPromise)
            }
            await Promise.all(NFTDataPromises)

            setNFTDatas(NFTDatas)
        }
        handleEffect()
    }, [])

    const _renderNFTs = (NFTDatas: NFTData[]): JSX.Element[] => {
        const cards: JSX.Element[] = []
        for (const NFTData of NFTDatas) {
            cards.push(<NFTCard data={NFTData} />)
        }
        return cards
    }
    return (
        <div className="max-w-[1024px] m-auto px-6 py-12">
            <div className="grid grid-cols-4 gap-6">
                {_renderNFTs(NFTDatas)}
            </div>
        </div>
    )

}

export default Page

export interface NFTData {
  tokenId: bigint;
  name: string;
  author: Address;
  collection: string;
  floor: number;
  description: string;
  externalUrl: string;
  tags: string[];
  imageBlobUrl: string;
}
