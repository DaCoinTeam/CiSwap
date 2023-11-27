"use client"

import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { ChainName } from "@config"
import { Image } from "@nextui-org/react"

const ConnectedChain = () => {
    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const connectedChainProps: Record<
    number,
    {
      imageUrl: string;
      text: "Mainnet" | "Testnet";
    }
  > = {
      [ChainName.KalytnTestnet]: {
          imageUrl: "/images/klaytn.svg",
          text: "Testnet",
      },
      [ChainName.KlaytnMainnet]: {
          imageUrl: "/images/klaytn.svg",
          text: "Mainnet",
      },
      [ChainName.PolygonTestnet]: {
          imageUrl: "/images/polygon.svg",
          text: "Testnet",
      },
      [ChainName.PolygonMainnet]: {
          imageUrl: "/images/polygon.svg",
          text: "Mainnet",
      },
  }

    const _imageUrl = connectedChainProps[chainName].imageUrl
    const _text = connectedChainProps[chainName].text
    return (
        <div className="flex gap-2 items-center text-sm">
            <Image src={_imageUrl} className="w-6 h-6" />
            <div>{_text}</div>
        </div>
    )
}

export default ConnectedChain
