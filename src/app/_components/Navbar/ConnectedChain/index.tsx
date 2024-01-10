"use client"

import React, { useContext } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { ChainId } from "@config"
import {
    Image,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/react"
import { MetamaskContext } from "@app/_hooks"
import { MetamaskManager } from "@blockchain"

const ConnectedChain = () => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)
    
    const { ethereumState} = useContext(MetamaskContext)!
    const { ethereum } = ethereumState

    const connectedchainInfos = [
        {
            chainId: ChainId.KalytnTestnet,
            imageUrl: "/images/klaytn.svg",
            text: "Klaytn Testnet",
        },
        {
            chainId: ChainId.KlaytnMainnet,
            imageUrl: "/images/klaytn.svg",
            text: "Klaytn Mainnet",
        },
        {
            chainId: ChainId.PolygonTestnet,
            imageUrl: "/images/polygon.svg",
            text: "Polygon Testnet",
        },
        {
            chainId: ChainId.PolygonMainnet,
            imageUrl: "/images/polygon.svg",
            text: "Polygon Mainnet",
        },
        {
            chainId: ChainId.BinanceSmartChainTestnet,
            imageUrl: "/images/binance-smart-chain.svg",
            text: "BSC Testnet",
        },
        {
            chainId: ChainId.BinanceSmartChainMainnet,
            imageUrl: "/images/binance-smart-chain.svg",
            text: "BSC Mainnet",
        },
    ]

    const imageUrl = connectedchainInfos.find(chain => chain.chainId === chainId)?.imageUrl
    const text = connectedchainInfos.find(chain => chain.chainId === chainId)?.text

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="light"
                    startContent={<Image radius="none" src={imageUrl} className="w-5 h-5" />}
                >
                    {text}
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
                {connectedchainInfos.map(chain => {
                    const onClick = async () => {
                        if (ethereum === null) return
                        const manager = new MetamaskManager(ethereum)
                        const response = await manager.switchEthereumChain(chain.chainId)
                        if (!response) return 
                        const code = response.code
                        if (!code) return 
                        if (code != 4902) return
                        await manager.addEthereumChain(chain.chainId)
                    }
                    return <DropdownItem onPress={onClick} startContent={<Image radius="none" src={chain.imageUrl} className="w-5 h-5" />} key={chain.chainId}> {chain.text} </DropdownItem>
                })}
                
            </DropdownMenu>
        </Dropdown>
    )
}

export default ConnectedChain