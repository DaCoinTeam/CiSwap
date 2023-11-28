import { SDKProvider } from "@metamask/sdk"
import { ChainId, chainInfos } from "@config"
import web3 from "web3"
import { Maybe } from "@metamask/providers/dist/utils"

class MetamaskApis {
    private ethereum: SDKProvider

    constructor(ethereum: SDKProvider) {
        this.ethereum = ethereum
    }

    async addEthereumChain(chainId: ChainId): Promise<Maybe<ErrorResponse>|null> {
        try{
            const params = chainInfos[chainId]
            if (!params) return

            return await this.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: web3.utils.toHex(chainId).toString(),
                        chainName: params.chainName,
                        rpcUrls: [params.httpRpcUrl],
                        iconUrls: [],
                        nativeCurrency: params.nativeCurrency,
                        blockExplorerUrls: [params.explorerUrl],
                    },
                ],
            })
        }  catch(ex){
            return ex as ErrorResponse
        }
    }

    async switchEthereumChain(chainId: ChainId): Promise<Maybe<ErrorResponse>> {
        try{
            return await this.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: web3.utils.toHex(chainId).toString(),
                    },
                ],
            })
        } catch(ex){
            return ex as ErrorResponse
        }
    }

    async requestAccounts() {
        await this.ethereum.request({ method: "eth_requestAccounts", params: [] })
    }

    async chainId(): Promise<number> {
        const chainId = await this.ethereum.request({ method: "eth_chainId" })
        return Number(web3.utils.toDecimal(String(chainId)))
    }
}

export default MetamaskApis

export interface ErrorResponse {
  code: number;
  message: string;
  stack: string;
}
