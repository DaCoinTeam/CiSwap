import { ChainId } from "@config"
import Web3, { Address, Bytes } from "web3"
import abi from "./abi"
import { getHttpWeb3 } from "../provider"

const getAggregatorContract = (web3: Web3, address: Address) =>
    new web3.eth.Contract(abi, address)

class AggregatorContract {
    private chainId: ChainId
    private address: Address

    constructor(chainId: ChainId, address: Address) {
        (this.chainId = chainId), (this.address = address)
    }

    async aggregatePriceX96(
        secondOffset: bigint,
        numberOfSnapshots: number,
        path: Bytes
    ) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getAggregatorContract(web3, this.address)
            return contract.methods
                .aggregatePriceX96(secondOffset, numberOfSnapshots, path)
                .call<bigint[]>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async aggregateLiquidity(
        secondOffset: bigint,
        numberOfSnapshots: bigint,
        tokenA: Address,
        tokenB: Address,
        indexPool: bigint
    ) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getAggregatorContract(web3, this.address)
            return contract.methods
                .aggregateLiquidity(
                    secondOffset,
                    numberOfSnapshots,
                    tokenA,
                    tokenB,
                    indexPool
                )
                .call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}
export default AggregatorContract
