"use client"
import React, { useEffect, useState } from "react"
import { ERC721Contract } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { chainInfos } from "@config"
import { getIpfsImageBlobUrl, getIpfsJson } from "../../api/next"
import { NFTURI } from "./create/_components/MainForm/formik"
import { NFTCard } from "./_components"
import { Address } from "web3"

const Page = () => {
    const chainName = useSelector((state : RootState) => state.blockchain.chainName)
    const [NFTDatas, setNFTDatas] = useState<NFTData[]>([])
    
    useEffect(() => {
        const handleEffect = async () => {
            const erc721Contract = new ERC721Contract(chainName, chainInfos[chainName].NFTAddress)
            const numNFTs = await erc721Contract.numNFTs()
            if (numNFTs == null) return 

            const CIDs: string[] = []
            const CIDPromises: Promise<void>[] = []
            for (let i: bigint = BigInt(0); i < numNFTs; i++){
                const CIDPromise = erc721Contract.tokenURI(i).then(
                    CID => {
                        if (CID == null) return
                        CIDs.push(CID)
                    })
                CIDPromises.push(CIDPromise)
            }
            await Promise.all(CIDPromises)
           
            const NFTDatas : NFTData[] = []
            const NFTDataPromises: Promise<void>[] = []
            for (let i: bigint = BigInt(0); i < numNFTs; i++){
                const NFTDataPromise = getIpfsJson(CIDs[Number(i)]).then(
                    async (URI) => {
                        if (URI == null) return
                        const _URI = URI as NFTURI

                        const imageBlobUrl = await getIpfsImageBlobUrl(_URI.imageCID) 
                        if (imageBlobUrl == null) return 

                        const data : NFTData = {
                            tokenId: i,
                            author: _URI.author,
                            collection : _URI.collection,
                            description : _URI.description,
                            externalUrl : _URI.externalUrl,
                            imageBlobUrl,
                            name: _URI.name,
                            tags : _URI.tags,
                        }

                        NFTDatas.push(data)
                    })
                NFTDataPromises.push(NFTDataPromise)
            }
            await Promise.all(NFTDataPromises)

            setNFTDatas(NFTDatas)
        }
        handleEffect()
    }, [])

    const _renderNFTs = (NFTDatas: NFTData[]): JSX.Element[] => {
        const cards: JSX.Element[] = []
        for (const NFTData of NFTDatas){
            cards.push(<NFTCard data={NFTData}/>)
        }
        return cards
    }
    return (
        <div className="grid grid-cols-4 gap-6">
            {_renderNFTs(NFTDatas)}
        </div>
    )
}

export default Page

export interface NFTData {
    tokenId: bigint;
    name: string;
    author: Address;
    collection: string;
    description: string;
    externalUrl: string;
    tags: string[]
    imageBlobUrl: string
  }
  