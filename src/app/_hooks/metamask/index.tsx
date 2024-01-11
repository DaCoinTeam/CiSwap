"use client"
import MetaMaskSDK, { MetaMaskSDKOptions, SDKProvider } from "@metamask/sdk"
import React, {
    Dispatch,
    SetStateAction,
    createContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import Web3, { utils } from "web3"
import { RegisteredSubscription } from "web3-eth"
import { ProvidersProps } from "@app/_shared"
import { chainInfos, defaultChainId } from "@config"
import {
    AppDispatch,
    setAccount,
    setChainId,
    setMetamaskWrongChainModal,
} from "@redux"
import { useDispatch } from "react-redux"
import { MetamaskManager } from "@blockchain"

export interface MetamaskProvidersProps {
  ethereumState: {
    ethereum: SDKProvider | null;
    setEthereum: Dispatch<SetStateAction<SDKProvider | null>>;
  };
  web3State: {
    web3: Web3<RegisteredSubscription> | null;
    setWeb3: Dispatch<SetStateAction<Web3<RegisteredSubscription> | null>>;
  };
}

export const MetamaskContext = createContext<MetamaskProvidersProps | null>(null)

const MetamaskProviders = (props: ProvidersProps) => {
    const [ethereum, setEthereum] = useState<SDKProvider | null>(null)
    const [web3, setWeb3] = useState<Web3<RegisteredSubscription> | null>(null)

    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        if (ethereum === null) return
        if (web3 === null) return

        ethereum.on("chainChanged", (chainId) => {
            const _chainId = Number(utils.toDecimal(chainId as string))
            const existedChainId = chainInfos[_chainId]

            if (!existedChainId) {
                dispatch(setMetamaskWrongChainModal(_chainId))
                return
            }

            dispatch(setChainId(_chainId))
        })
        return () => {
            ethereum.removeAllListeners()
        }
    }, [ethereum])

    useEffect(() => {
        const handleEffect = async () => {
            const options: MetaMaskSDKOptions = {
                dappMetadata: {
                    name: "CiSwap",
                    url: "https://ciswap-dacointeam.vercel.app/",
                },
                extensionOnly: true,
            }
            const MMSDK = new MetaMaskSDK(options)
            await MMSDK.init()
            const _ethereum = MMSDK.getProvider()
            setEthereum(_ethereum)
        }
        handleEffect()
    }, [])

    useEffect(() => {
        if (ethereum === null) return
        if (web3 === null) return

        const manager = new MetamaskManager(ethereum)

        if (web3 === null) {
            dispatch(setAccount(""))
            dispatch(setChainId(defaultChainId))
            return
        }
        const handleEffect = async () => {
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            dispatch(setAccount(account))

            const chainId = await manager.chainId()
            dispatch(setChainId(chainId))
        }
        handleEffect()
    }, [web3])

    const metamaskContext = useMemo(() => {
        return {
            ethereumState: {
                ethereum,
                setEthereum,
            },
            web3State: {
                web3,
                setWeb3,
            },
        }
    }, [ethereum, web3])

    return (
        <MetamaskContext.Provider value={metamaskContext}>
            {props.children}
        </MetamaskContext.Provider>
    )
}

export default MetamaskProviders
