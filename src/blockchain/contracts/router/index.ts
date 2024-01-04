import { ChainId, GAS_LIMIT, GAS_PRICE, chainInfos } from "@config"
import Web3, { Address, Bytes } from "web3"
import abi from "./abi"

const getRouterContract = (web3: Web3, chainId: ChainId) =>
    new web3.eth.Contract(abi, chainInfos[chainId].router)

class RouterContract {
    private chainId: ChainId
    private router: Address
    private sender?: Address
    private web3?: Web3

    constructor(chainId: ChainId, web3?: Web3, sender?: Address) {
        this.chainId = chainId;
        (this.router = chainInfos[chainId].router), (this.web3 = web3)
        this.sender = sender
    }

    async exactInput(params: ExactInputParams) {
        try {
            if (!this.web3) return null

            const contract = getRouterContract(this.web3, this.chainId)
            const data = contract.methods.exactInput(params).encodeABI()

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.router,
                data: data,
                gasLimit: GAS_LIMIT,
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

            const contract = getRouterContract(this.web3, this.chainId)
            const data = contract.methods.exactInputSingle(params).encodeABI()

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.router,
                data: data,
                gasLimit: GAS_LIMIT,
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

            const contract = getRouterContract(this.web3, this.chainId)
            const data = contract.methods.exactOutput(params).encodeABI()

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.router,
                data: data,
                gasLimit: GAS_LIMIT,
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

            const contract = getRouterContract(this.web3, this.chainId)
            const data = contract.methods.exactOutputSingle(params).encodeABI()

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.router,
                data: data,
                gasLimit: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async multicall(data: Bytes[]) {
        try {
            if (!this.web3) return null

            const contract = getRouterContract(this.web3, this.chainId)
            const _data = contract.methods.multicall(data).encodeABI()
            console.log(data)

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.router,
                data: _data,
                gasLimit: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async multicall2(data: Bytes[]) {
        try {
            if (!this.web3) return null

            const contract = getRouterContract(this.web3, this.chainId)
            const _data = contract.methods.multicall2(data).encodeABI()
            console.log(data)

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.router,
                data: _data,
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
