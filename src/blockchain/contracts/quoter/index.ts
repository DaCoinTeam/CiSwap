import { ChainId } from "@config"
import Web3, { Address, Bytes } from "web3"
import abi from "./abi"
import { getHttpWeb3 } from "../provider"

const getQuoterContract = (web3: Web3, address: Address) =>
    new web3.eth.Contract(abi, address)

class QuoterContract {
    private chainId: ChainId
    private address: Address

    constructor(chainId: ChainId, address: Address) {
        this.chainId = chainId
        this.address = address
    }

    async quoteExactInput(amountIn: bigint, path: Bytes) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getQuoterContract(web3, this.address)
            return contract.methods.quoteExactInput(amountIn, path).call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    getInstance() {
        const web3 = getHttpWeb3(this.chainId)
        return getQuoterContract(web3, this.address)
    }

    async quoteExactInputSingle(
        amountIn: bigint,
        tokenIn: Address,
        tokenOut: Address,
        indexPool: bigint
    ) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getQuoterContract(web3, this.address)
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
            const contract = getQuoterContract(web3, this.address)
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
            const contract = getQuoterContract(web3, this.address)
            return contract.methods
                .quoteExactOutputSingle(amountOut, tokenIn, tokenOut, indexPool)
                .call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async quotePriceX96(path: Bytes) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getQuoterContract(web3, this.address)
            return contract.methods.quotePriceX96(path).call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}
export default QuoterContract
