import { ChainName, GAS_LIMIT, GAS_PRICE } from "../../config"
import Web3, { Address, HexString } from "web3"
import abi from "./abi"
import { getHttpWeb3 } from "../provider"
import { uniqueArray } from "@utils"

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
        web3?: Web3,
        sender?: Address
    ) {
        this.chainName = chainName
        this.poolAddress = poolAddress
        this.web3 = web3
        this.sender = sender
    }

    async getAwardEvents(address: Address) {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)

            return await contract.getPastEvents("Award", {
                fromBlock: 0,
                toBlock: "latest",
                filter: {
                    provider: address
                }
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async getTransactionHashs() {
        try {

            const transactions : HexString[] = []
            const web3 = getHttpWeb3(this.chainName)
            const logs = await web3.eth.getPastLogs({
                address: this.poolAddress,
                fromBlock: 0,
                toBlock: "latest"
            })

            for (const log of logs){
                if (typeof log == "string") return null
                transactions.push(log.transactionHash as HexString)
            }
            return uniqueArray(transactions)
        } catch (ex) {
            console.log(ex)
            return null
        }
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

    async protocolFee() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return Number(await contract.methods.protocolFee().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token1AmountOut(_token0AmountIn: bigint, controller?: AbortController) {
        try {
            const web3 = getHttpWeb3(this.chainName, controller)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return BigInt(
                await contract.methods.token1AmountOut(_token0AmountIn).call()
            )
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token0AmountOut(_token1AmountIn: bigint, controller?: AbortController) {
        try {
            const web3 = getHttpWeb3(this.chainName, controller)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return BigInt(
                await contract.methods.token0AmountOut(_token1AmountIn).call()
            )
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token0AmountOutWithLPTokensIn(
        _LPTokenAmountIn: bigint,
        controller?: AbortController
    ) {
        try {
            const web3 = getHttpWeb3(this.chainName, controller)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return BigInt(
                await contract.methods
                    .token0AmountOutWithLPTokensIn(_LPTokenAmountIn)
                    .call()
            )
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token0Price() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return BigInt(await contract.methods.token0Price().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token0BasePrice() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return BigInt(await contract.methods.token0BasePrice().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token0MaxPrice() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return BigInt(await contract.methods.token0MaxPrice().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async isProviderRegistered(_address: Address) {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return await contract.methods.isProviderRegistered(_address).call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async registerProvider() {
        try {
            if (this.web3 == null) return
            const contract = getLiquidityPoolContract(this.web3, this.poolAddress)
            const data = contract.methods.registerProvider().encodeABI()

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.poolAddress,
                data,
                gasLimit: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async name() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return await contract.methods.name().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async symbol() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return await contract.methods.symbol().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async decimals() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return Number(await contract.methods.decimals().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async providerRegisters() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return await contract.methods.providerRegisters().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async balanceOf(_owner: Address) {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return BigInt(
                (await contract.methods.balanceOf(_owner).call()).toString()
            )
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async totalSupply() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return BigInt(
                (await contract.methods.totalSupply().call()).toString()
            )
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async swap(
        _tokenAmountIn: bigint,
        _minTokenAmountOut: bigint,
        _isBuyAction: boolean
    ) {
        try {
            if (this.web3 == null) return
            const contract = getLiquidityPoolContract(this.web3, this.poolAddress)
            const data = contract.methods
                .swap(_tokenAmountIn, _minTokenAmountOut, _isBuyAction)
                .encodeABI()

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.poolAddress,
                data,
                gasLimit: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async deposit(_token1AmountIn: bigint, _minLPTokenAmountOut: bigint) {
        try {
            if (this.web3 == null) return
            const contract = getLiquidityPoolContract(this.web3, this.poolAddress)
            const data = contract.methods
                .deposit(_token1AmountIn, _minLPTokenAmountOut)
                .encodeABI()

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.poolAddress,
                data,
                gasLimit: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async withdraw(_LPTokenAmountIn: bigint) {
        try {
            if (this.web3 == null) return
            const contract = getLiquidityPoolContract(this.web3, this.poolAddress)
            const data = contract.methods.withdraw(_LPTokenAmountIn).encodeABI()

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.poolAddress,
                data,
                gasLimit: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async getAllBaseTicks() : Promise<BaseTick[] | null> {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return (await contract.methods.getAllBaseTicks().call()).map(item => {
                return {
                    token0AmountLocked: BigInt(item.token0AmountLocked),
                    token1AmountLocked: BigInt(item.token1AmountLocked),
                    token0Price: BigInt(item.token0Price),
                    timestamp: Number(item.timestamp)
                }
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async getAllLPTokenTicks() : Promise<LPTokenTick[] | null> {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getLiquidityPoolContract(web3, this.poolAddress)
            return (await contract.methods.getAllLPTokenTicks().call()).map(item => {
                return {
                    totalSupply: BigInt(item.totalSupply),
                    LPTokenAmountLocked: BigInt(item.LPTokenAmountLocked),
                    timestamp: Number(item.timestamp)
                }
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}

export default LiquidityPoolContract

export interface BaseTick {
  token0AmountLocked: bigint;
  token1AmountLocked: bigint;
  token0Price: bigint;
  timestamp: number;
}

export interface LPTokenTick {
  totalSupply: bigint;
  LPTokenAmountLocked: bigint;
  timestamp: number;
}
