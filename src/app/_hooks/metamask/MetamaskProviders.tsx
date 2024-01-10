"use client"
import { SDKProvider } from "@metamask/sdk"
import { Dispatch, SetStateAction, createContext, useState } from "react"
import Web3 from "web3"
import { RegisteredSubscription } from "web3-eth"
import { ContextProps } from "@app/_shared"
import React from "react"

import useMetamask from "./useMetamask.hook"

export interface MetamaskContextProps {
  ethereumState: {
    ethereum: SDKProvider | null;
    setEthereum: Dispatch<SetStateAction<SDKProvider | null>>;
  };
  web3State: {
    web3: Web3<RegisteredSubscription> | null;
    setWeb3: Dispatch<SetStateAction<Web3<RegisteredSubscription> | null>>;
  };
}

export const MetamaskContext = createContext<MetamaskContextProps | null>(null)

const MetamaskProviders = (props: ContextProps) => {
    const [ethereum, setEthereum] = useState<SDKProvider | null>(null)
    const [web3, setWeb3] = useState<Web3<RegisteredSubscription> | null>(null)

    useMetamask()

    return (
        <MetamaskContext.Provider
            value={{
                ethereumState: {
                    ethereum,
                    setEthereum,
                },
                web3State: {
                    web3,
                    setWeb3,
                },
            }}
        >
            {props.children}
        </MetamaskContext.Provider>
    )
}

export default MetamaskProviders
