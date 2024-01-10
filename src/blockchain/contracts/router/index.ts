import { ChainId, GAS_LIMIT, GAS_PRICE } from "@config"
import Web3, { Address, Bytes } from "web3"
import abi from "./abi"

const getRouterContract = (web3: Web3, address: Address) =>
    new web3.eth.Contract(abi, address)

class RouterContract {
    private chainId: ChainId
    private address: Address
    private sender?: Address
    private web3?: Web3

    constructor(
        chainId: ChainId,
        address: Address,
        web3?: Web3,
        sender?: Address
    ) {
        this.chainId = chainId
        this.address = address
        this.web3 = web3
        this.sender = sender
    }

    async exactInput(params: ExactInputParams) {
        try {
            if (!this.web3) return null

            const contract = getRouterContract(this.web3, this.address)
            return await contract.methods.exactInput(params).send({
                from: this.sender,
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async exactInputSingle(params: ExactInputSingleParams) {
        try {
            if (!this.web3) return null

            const contract = getRouterContract(this.web3, this.address)
            return await contract.methods.exactInputSingle(params).send({
                from: this.sender,
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async exactOutput(params: ExactOutputParams) {
        try {
            if (!this.web3) return null

            const contract = getRouterContract(this.web3, this.address)
            return await contract.methods.exactOutput(params).send({
                from: this.sender,
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async exactOutputSingle(params: ExactOutputSingleParams) {
        try {
            if (!this.web3) return null

            const contract = getRouterContract(this.web3, this.address)
            return await contract.methods.exactOutputSingle(params).send({
                from: this.sender,
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}

export default RouterContract

export interface ExactInputSingleParams {
  amountIn: bigint;
  amountOutMin: bigint;
  recipient: Address;
  tokenIn: Address;
  tokenOut: Address;
  indexPool: number;
  deadline: number;
}

export interface ExactInputParams {
  amountIn: bigint;
  amountOutMin: bigint;
  recipient: Address;
  path: Bytes;
  deadline: number;
}

export interface ExactOutputParams {
  amountOut: bigint;
  amountInMax: bigint;
  recipient: Address;
  path: Bytes;
  deadline: number;
}

export interface ExactOutputSingleParams {
  amountOut: bigint;
  amountInMax: bigint;
  recipient: Address;
  tokenIn: Address;
  tokenOut: Address;
  indexPool: number;
  deadline: number;
}
