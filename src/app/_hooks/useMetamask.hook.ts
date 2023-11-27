import MetaMaskSDK, {  } from "@metamask/sdk"
import { useSDK } from "@metamask/sdk-react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@redux"

const useMetamask = () => {
    const { sdk, connected, connecting, provider, chainId } = useSDK()  
    const ethereum = useSelector((state: RootState) => state.blockchain.ethereum)
    useEffect(() => {
        if (ethereum == null) return 
        console.log("C")
        const handleChainChanged = (chainId: unknown) => {
            console.log(chainId)
        }
        const handleEffect = async () => {
            ethereum.on("chainChanged", handleChainChanged)
        }
        handleEffect()
        return (() => {
            ethereum.removeListener("chainChanged", handleChainChanged)
        })
    }, [ethereum])
    return { a: "1"}
}
export default useMetamask