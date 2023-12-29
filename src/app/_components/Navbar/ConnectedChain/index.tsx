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
import { MetamaskApis } from "@blockchain"

const ConnectedChain = () => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)
    
    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext == null) return
    const { ethereumState } = metamaskContext
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

    const _imageUrl = connectedchainInfos.find(chain => chain.chainId == chainId)?.imageUrl
    const _text = connectedchainInfos.find(chain => chain.chainId == chainId)?.text

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="light"
                    startContent={<Image radius="none" src={_imageUrl} className="w-5 h-5" />}
                >
                    {_text}
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
                {connectedchainInfos.map(chain => {
                    const _handleSwitch = async () => {
                        if (ethereum == null) return
                        const metamaskApis = new MetamaskApis(ethereum)
                        const response = await metamaskApis.switchEthereumChain(chain.chainId)
                        console.log(response)
                        if (!response) return 
                        const code = response.code
                        if (!code) return 
                        console.log(1)
                        if (code != 4902) return
                        console.log(2)
                        const _res = await metamaskApis.addEthereumChain(chain.chainId)
                        console.log(_res)
                    }
                    return <DropdownItem onPress={_handleSwitch} startContent={<Image radius="none" src={chain.imageUrl} className="w-5 h-5" />} key={chain.chainId}> {chain.text} </DropdownItem>
                })}
                
            </DropdownMenu>
        </Dropdown>
    )
}

export default ConnectedChain