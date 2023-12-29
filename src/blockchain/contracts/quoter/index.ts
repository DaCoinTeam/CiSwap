import { ChainId, chainInfos } from "@config"
import Web3, { Address, Bytes } from "web3"
import abi from "./abi"
import { getHttpWeb3 } from "../provider"

const getQuoterContract = (web3: Web3, chainId: ChainId) =>
    new web3.eth.Contract(abi, chainInfos[chainId].quoterAddress)

class QuoterContract {
    private chainId: ChainId

    constructor(chainId: ChainId) {
        this.chainId = chainId
    }

    async quoteExactInput(amountIn: bigint, path: Bytes) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getQuoterContract(web3, this.chainId)
            return contract.methods.quoteExactInput(amountIn, path).call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async quoteExactInputSingle(
        amountIn: bigint,
        tokenIn: Address,
        tokenOut: Address,
        indexPool: bigint
    ) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getQuoterContract(web3, this.chainId)
            return contract.methods
                .quoteExactInputSingle(amountIn, tokenIn, tokenOut, indexPool)
                .call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async quoteExactOutput(amountOut: bigint, path: Bytes) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getQuoterContract(web3, this.chainId)
            return contract.methods.quoteExactOutput(amountOut, path).call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async quoteExactOutputSingle(
        amountOut: bigint,
        tokenIn: Address,
        tokenOut: Address,
        indexPool: bigint
    ) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getQuoterContract(web3, this.chainId)
            return contract.methods
                .quoteExactOutputSingle(amountOut, tokenIn, tokenOut, indexPool)
                .call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}
export default QuoterContract
