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
            return await contract.methods.protocolFee().call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async getAmountOut(
        _amountTokenIn: bigint,
        _zeroForOne: boolean,
        controller?: AbortController
    ) {
        try {
            const web3 = getHttpWeb3(this.chainId, controller)
            const contract = getPoolContract(web3, this.poolAddress)
            return await contract.methods
                .getAmountOut(_amountTokenIn, _zeroForOne)
                .call<bigint>()
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
            return await contract.methods.balanceOf(_owner).call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async liquidity() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return await contract.methods.liquidity().call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async kLast() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return await contract.methods.kLast().call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async totalSupply() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getPoolContract(web3, this.poolAddress)
            return await contract.methods.totalSupply().call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async swap(
        _amountIn: bigint,
        _minAmountOut: bigint,
        _zeroForOne: boolean,
        _deadline: bigint
    ) {
        try {
            if (this.web3 == null) return
            const contract = getPoolContract(this.web3, this.poolAddress)
            const data = contract.methods
                .swap(_amountIn, _minAmountOut, _zeroForOne, _deadline)
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

    async addLiquidity(
        _amount0Desired: bigint,
        _amount1Desired: bigint,
        _amount0Min: bigint,
        _amount1Min: bigint,
        _deadline: bigint
    ) {
        try {
            if (this.web3 == null) return
            const contract = getPoolContract(this.web3, this.poolAddress)
            const data = contract.methods
                .addLiquidity(
                    _amount0Desired,
                    _amount1Desired,
                    _amount0Min,
                    _amount1Min,
                    _deadline
                )
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
        _amountLP: bigint,
        _amount0Min: bigint,
        _amount1Min: bigint,
        _deadline: bigint
    ) {
        try {
            if (this.web3 == null) return
            const contract = getPoolContract(this.web3, this.poolAddress)
            const data = contract.methods
                .removeLiquidity(_amountLP, _amount0Min, _amount1Min, _deadline)
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
