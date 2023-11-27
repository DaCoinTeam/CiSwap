import { AppDispatch, RootState, setChainId, setWrongChainMetamaskModalChainId, setWrongChainMetamaskModalShow } from "@redux"
import { useContext, useEffect } from "react"
import { MetamaskContext } from "./MetamaskProviders"
import { useDispatch, useSelector } from "react-redux"
import web3 from "web3"
import { chainInfos } from "@config"

const useMetamask = () => {
    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext == null) return 
    const { ethereumState } = metamaskContext
    const { ethereum } = ethereumState

    const dispatch: AppDispatch = useDispatch()
    const chainId = useSelector((state: RootState) => state.blockchain.chainId) 
    console.log(chainId)

    useEffect(() => {
        if (ethereum == null) return 

        ethereum.on("chainChanged", (chainId) => {
            const _chainId = Number(web3.utils.toDecimal(chainId as string))
            const existedChainId = chainInfos[_chainId]
            console.log(existedChainId)
            if (!existedChainId)
            {
                dispatch(setWrongChainMetamaskModalShow(true))
                dispatch(setWrongChainMetamaskModalChainId(_chainId))
                return
            }

            dispatch(setChainId(_chainId))
        })
        return (() => {
            ethereum.removeAllListeners()
        })
    }, [ethereum])
}
export default useMetamask