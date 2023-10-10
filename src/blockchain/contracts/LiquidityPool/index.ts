import { ChainName, getHttpWeb3 } from "@blockchain"
import Web3, { Address } from "web3"
import abi from "./abi"

const getLiquidityPoolContract = (web3: Web3, poolAddress: Address) =>
    new web3.eth.Contract(abi, poolAddress, web3)

class LiquidityPoolContract {
    private chainName: ChainName
    private poolAddress: Address
    private sender?: Address
    private web3?: Web3

    constructor(
        chainName: ChainName,
        poolAddress: Address,
        sender?: Address,
        web3?: Web3
    ) {
        (this.chainName = chainName),
        (this.sender = sender),
        (this.poolAddress = poolAddress),
        (this.web3 = web3)
    }

    async token0() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return await contract.methods.token0().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token1() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return await contract.methods.token1().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token1AmountOut(_token0AmountIn: bigint, controller?: AbortController) {
        try {
            const web3 = getHttpWeb3(this.chainName, controller)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return await contract.methods.token1AmountOut(_token0AmountIn).call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token0AmountOut(_token1AmountIn: bigint, controller?: AbortController) {
        try {
            const web3 = getHttpWeb3(this.chainName, controller)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return await contract.methods.token0AmountOut(_token1AmountIn).call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token0Price() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return await contract.methods.token0Price().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}

export default LiquidityPoolContract
