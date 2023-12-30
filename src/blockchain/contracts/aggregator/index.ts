import { ChainId, chainInfos } from "@config"
import Web3, { Address, Bytes } from "web3"
import abi from "./abi"
import { getHttpWeb3 } from "../provider"

const getAggregatorContract = (web3: Web3, chainId: ChainId) =>
    new web3.eth.Contract(abi, chainInfos[chainId].aggregator)

class AggregatorContract {
    private chainId: ChainId

    constructor(chainId: ChainId) {
        this.chainId = chainId
    }

    async aggregatePriceX96(
        secondOffset: bigint,
        numberOfSnapshots: bigint,
        path: Bytes
    ) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getAggregatorContract(web3, this.chainId)
            return contract.methods
                .aggregatePriceX96(secondOffset, numberOfSnapshots, path)
                .call()
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
            const contract = getAggregatorContract(web3, this.chainId)
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
