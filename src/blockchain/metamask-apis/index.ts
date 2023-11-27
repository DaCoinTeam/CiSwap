import { SDKProvider } from "@metamask/sdk"
import { ChainId } from "@config"
import web3 from "web3"

class MetamaskApis {
    private ethereum: SDKProvider
  
    constructor(ethereum: SDKProvider) {
        this.ethereum = ethereum
    }
  
    async addEthereumChain(chainId: ChainId): Promise<void> {
        await this.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainId: web3.utils.toHex(chainId).toString(),
                },
            ],
        })
    }

    async switchEthereumChain(chainId: ChainId): Promise<void> {
        await this.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: web3.utils.toHex(chainId).toString(),
                },
            ],
        })
    }
  
    async requestAccounts() {
        await this.ethereum.request({ method: "eth_requestAccounts", params: [] })
    }
  
    async chainId() : Promise<number> {
        const chainId = await this.ethereum.request({ method: "eth_chainId" })
        return Number(web3.utils.toDecimal(String(chainId)))
    }
}
  
export default MetamaskApis