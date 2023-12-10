import { ChainId, GAS_LIMIT, GAS_PRICE, chains } from "@config"
import Web3, { Address, Bytes } from "web3"
import abi from "./abi"
import { getHttpWeb3 } from "../provider"

const getRouterContract = (web3: Web3, chainId: ChainId) =>
    new web3.eth.Contract(abi, chains[chainId].routerAddress)

class RouterContract {
    private chainId: ChainId
    private routerAddress: Address
    private sender?: Address
    private web3?: Web3

    constructor(chainId: ChainId, web3?: Web3, sender?: Address) {
        this.chainId = chainId;
        (this.routerAddress = chains[chainId].routerAddress), (this.web3 = web3)
        this.sender = sender
    }

    async getAmountsOut(
        _amountIn: bigint,
        _tokenIn: Address,
        _path: Address[],
        controller?: AbortController
    ) {
        try {
            const web3 = getHttpWeb3(this.chainId, controller)
            const contract = getRouterContract(web3, this.chainId)
            return await contract.methods
                .getAmountsOut(_amountIn, _tokenIn, _path)
                .call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async multicall(_data: Bytes[]) {
        try {
            if (!this.web3) return

            const contract = getRouterContract(this.web3, this.chainId)
            const data = contract.methods.multicall(_data).encodeABI()

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.routerAddress,
                data,
                gasLimit: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}

export default RouterContract
