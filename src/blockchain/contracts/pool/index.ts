import { ChainId, GAS_LIMIT, GAS_PRICE } from "@config"
import Web3, { Address, HexString } from "web3"
import abi from "./abi"
import { getHttpWeb3 } from "../provider"
import { uniqueArray } from "@utils"

const getPoolContract = (web3: Web3, poolAddress: Address) =>
    new web3.eth.Contract(abi, poolAddress, web3)

class PoolContract {
    private chainId: ChainId
    private poolAddress: Address
    private sender?: Address
    private web3?: Web3

    constructor(
        chainId: ChainId,
        poolAddress: Address,
        web3?: Web3,
        sender?: Address
    ) {
        this.chainId = chainId
        this.poolAddress = poolAddress
        this.web3 = web3
        this.sender = sender
    }

    // async getAwardEvents(address: Address) {
    //     try {
    //         const web3 = getHttpWeb3(this.chainId)
    //         const contract = getPoolContract(web3, this.poolAddress)

    //         return await contract.getPastEvents("Award", {
    //             fromBlock: 0,
    //             toBlock: "latest",
    //             filter: {
    //                 provider: address
    //             }
    //         })
    //     } catch (ex) {
    //         console.log(ex)
    //         return null
    //     }
    // }

    async getTransactionHashs() {
        try {
            const transactions: HexString[] = []
            const web3 = getHttpWeb3(this.chainId)
            const logs = await web3.eth.getPastLogs({
                address: this.poolAddress,
                fromBlock: 0,
                toBlock: "latest",
            })

            for (const log of logs) {
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
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return await contract.methods.token0().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async token1() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return await contract.methods.token1().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async protocolFee() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return Number(await contract.methods.protocolFee().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async tokenAmountOut(
        _amountTokenIn: bigint,
        _isToken0: boolean,
        controller?: AbortController
    ) {
        try {
            const web3 = getHttpWeb3(this.chainId, controller)
            const contract = getPoolContract(web3, this.poolAddress)
            return BigInt(
                await contract.methods.amountTokenOut(_amountTokenIn, _isToken0).call()
            )
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async isProvider(_address: Address) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return await contract.methods.isProvider(_address).call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async register() {
        try {
            if (this.web3 == null) return
            const contract = getPoolContract(this.web3, this.poolAddress)
            const data = contract.methods.register().encodeABI()

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
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return await contract.methods.name().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async symbol() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return await contract.methods.symbol().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async decimals() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return Number(await contract.methods.decimals().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async providerRegisters() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return await contract.methods.providerRegisters().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async balanceOf(_owner: Address) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return BigInt(
                (await contract.methods.balanceOf(_owner).call()).toString()
            )
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async liquidity() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return BigInt((await contract.methods.liquidity().call()).toString())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async kLast() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return BigInt((await contract.methods.kLast().call()).toString())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async totalSupply() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return BigInt((await contract.methods.totalSupply().call()).toString())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async swap(
        _amountTokenIn: bigint,
        _minAmountTokenOut: bigint,
        _isToken0: boolean
    ) {
        try {
            if (this.web3 == null) return
            const contract = getPoolContract(this.web3, this.poolAddress)
            const data = contract.methods
                .swap(_amountTokenIn, _minAmountTokenOut, _isToken0)
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

    async addLiquidity(_amountToken0Added: bigint, _amountToken1Added: bigint) {
        try {
            if (this.web3 == null) return
            const contract = getPoolContract(this.web3, this.poolAddress)
            const data = contract.methods
                .addLiquidity(_amountToken0Added, _amountToken1Added)
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

    async removeLiquidity(
        _amountLPTokenRemoved: bigint,
        _percentageOfAmountToken0Received: bigint
    ) {
        try {
            if (this.web3 == null) return
            const contract = getPoolContract(this.web3, this.poolAddress)
            const data = contract.methods
                .removeLiquidity(_amountLPTokenRemoved, _percentageOfAmountToken0Received)
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

    // async getAllBaseTicks(): Promise<BaseTick[] | null> {
    //     try {
    //         const web3 = getHttpWeb3(this.chainId)
    //         const contract = getPoolContract(web3, this.poolAddress)
    //         return (await contract.methods.getAllBaseTicks().call()).map((item) => {
    //             return {
    //                 token0AmountLocked: BigInt(item.token0AmountLocked),
    //                 token1AmountLocked: BigInt(item.token1AmountLocked),
    //                 token0Price: BigInt(item.token0Price),
    //                 timestamp: Number(item.timestamp),
    //             }
    //         })
    //     } catch (ex) {
    //         console.log(ex)
    //         return null
    //     }
    // }

    // async getAllLPTokenTicks(): Promise<LPTokenTick[] | null> {
    //     try {
    //         const web3 = getHttpWeb3(this.chainId)
    //         const contract = getPoolContract(web3, this.poolAddress)
    //         return (await contract.methods.getAllLPTokenTicks().call()).map(
    //             (item) => {
    //                 return {
    //                     totalSupply: BigInt(item.totalSupply),
    //                     LPTokenAmountLocked: BigInt(item.LPTokenAmountLocked),
    //                     timestamp: Number(item.timestamp),
    //                 }
    //             }
    //         )
    //     } catch (ex) {
    //         console.log(ex)
    //         return null
    //     }
    // }
}

export default PoolContract

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
