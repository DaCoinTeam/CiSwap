import {
    AppDispatch,
    setAccount,
    setChainId,
    setMetamaskWrongChainModal,
} from "@redux"

import { useDispatch } from "react-redux"
import { utils } from "web3"
import { chainInfos, defaultChainId } from "@config"
import MetaMaskSDK, { MetaMaskSDKOptions } from "@metamask/sdk"
import { MetamaskManager } from "../../../blockchain/providers"
import { useContext, useEffect } from "react"
import { MetamaskContext } from "."



const useMetamask = () => {
    const { ethereumState, web3State } = useContext(MetamaskContext)!

    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        const ethereum = ethereumState.ethereum 
        const web3 = web3State.web3

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
    }, [ethereumState.ethereum])

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
            ethereumState.setEthereum(_ethereum)
        }
        handleEffect()
    }, [])

    useEffect(() => {
        const ethereum = ethereumState.ethereum
        const web3 = web3State.web3

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
    }, [web3State.web3])
}
export default useMetamask
