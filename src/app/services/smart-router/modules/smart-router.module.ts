import {
    QuoterContract,
    FactoryContract,
    PoolContract,
    MulticallContract,
} from "@blockchain"
import { ChainId, chainInfos } from "@config"
import web3, { Address, Bytes } from "web3"
import Path from "./path.module"
import Pool from "./pool.module"
import {
    findMaxBigIntIndexAndValue,
    findMinBigIntIndexAndValue,
} from "../../../../utils/array"

const MAX_HOPS = 2

class SmartRouter {
    private chainId: ChainId
    private factoryContract: FactoryContract
    private quoterContract: QuoterContract
    private multicallContract: MulticallContract

    constructor(chainId: ChainId) {
        this.chainId = chainId
        this.factoryContract = new FactoryContract(this.chainId)
        this.quoterContract = new QuoterContract(
            this.chainId,
            chainInfos[chainId].quoterAddress
        )
        this.multicallContract = new MulticallContract(
            this.chainId,
            chainInfos[chainId].quoterAddress
        )
    }

    private async getAllPools(): Promise<Pool[] | null> {
        const poolAddresses = await this.factoryContract.allPools()
        if (poolAddresses == null) return null
        const pools: Pool[] = []
        const promises: Promise<void>[] = []
        for (const poolAddress of poolAddresses) {
            const promise = async () => {
                const poolContract = new PoolContract(this.chainId, poolAddress)
                const token0 = await poolContract.token0()
                if (token0 == null) return
                const token1 = await poolContract.token1()
                if (token1 == null) return
                const indexPool = await poolContract.indexPool()
                if (indexPool == null) return
                pools.push(new Pool(token0, token1, indexPool))
            }
            promises.push(promise())
        }
        await Promise.all(promises)
        return pools
    }

    private async getAllPaths(
        tokenStart: Address,
        tokenEnd: Address
    ): Promise<Path[] | null> {
        let restPaths: Path[] = []
        const exactEndPaths: Path[] = []
        const pools = await this.getAllPools()
        if (pools == null) return null

        for (const pool of pools) {
            const pathCurrent = new Path()
            const createResult = pathCurrent.create(pool, tokenStart)
            if (!createResult) continue
            if (pathCurrent.getLast() == tokenEnd) {
                exactEndPaths.push(pathCurrent)
                continue
            }
            restPaths.push(pathCurrent)
        }
        console.log(restPaths)

        let hopsCount = 0
        while (restPaths.length) {
            if (hopsCount == MAX_HOPS) break

            const restPathsTemp: Path[] = []
            const exactEndPathsTemp: Path[] = []

            for (const restPath of restPaths) {
                const { exactEndPaths: _exactEndPaths, restPaths: _restPaths } =
          restPath.generatePathsFromNextHop(pools, tokenEnd)
                exactEndPathsTemp.push(..._exactEndPaths)
                restPathsTemp.push(..._restPaths)
            }
            exactEndPaths.push(...exactEndPathsTemp)
            restPaths = restPathsTemp

            hopsCount++
        }

        return exactEndPaths
    }
    async findBestRouteExactInput(
        amountIn: bigint,
        tokenIn: Address,
        tokenOut: Address
    ): Promise<BestRouteResult | null> {
        return this.findBestRoute(
            amountIn,
            tokenIn,
            tokenOut,
            QuoteType.ExactInput
        )
    }

    async findBestRouteExactOutput(
        amountIn: bigint,
        tokenIn: Address,
        tokenOut: Address
    ): Promise<BestRouteResult | null> {
        return this.findBestRoute(
            amountIn,
            tokenOut,
            tokenIn,
            QuoteType.ExactOutput
        )
    }

    private async findBestRoute(
        amountIn: bigint,
        tokenStart: Address,
        tokenEnd: Address,
        type: QuoteType
    ): Promise<BestRouteResult | null> {
        const paths = await this.getAllPaths(tokenStart, tokenEnd)

        if (paths == null) return null
        const data: Bytes[] = []
        for (const path of paths) {
            let encodedFunction: Bytes
            switch (type) {
            case QuoteType.ExactInput:
                encodedFunction =
            path.steps.length == 3
                ? this.quoterContract
                    .getInstance()
                    .methods.quoteExactInputSingle(
                        amountIn,
                        path.getFirstPool().tokenStart,
                        path.getFirstPool().tokenEnd,
                        path.getFirstPool().indexPool
                    )
                    .encodeABI()
                : (encodedFunction = this.quoterContract
                    .getInstance()
                    .methods.quoteExactInput(amountIn, path.encodePacked())
                    .encodeABI())

                break
            case QuoteType.ExactOutput:
                encodedFunction =
            path.steps.length == 3
                ? this.quoterContract
                    .getInstance()
                    .methods.quoteExactOutputSingle(
                        amountIn,
                        path.getFirstPool().tokenStart,
                        path.getFirstPool().tokenEnd,
                        path.getFirstPool().indexPool
                    )
                    .encodeABI()
                : this.quoterContract
                    .getInstance()
                    .methods.quoteExactOutput(amountIn, path.encodePacked())
                    .encodeABI()

                break
            }
            data.push(encodedFunction)
        }
        const bytes = await this.multicallContract.multicall(data).call()
        if (bytes == null) return null

        const amountsQuoted = bytes.map((byte) =>
            BigInt(web3.utils.hexToNumber(web3.utils.bytesToHex(byte)))
        )

        const { index, value } =
      type == QuoteType.ExactInput
          ? findMaxBigIntIndexAndValue(amountsQuoted)
          : findMinBigIntIndexAndValue(amountsQuoted)

        return {
            path: paths[index],
            amount: value,
        }
    }
}
export default SmartRouter

export enum QuoteType {
  ExactInput,
  ExactOutput,
}

export interface BestRouteResult {
  amount: bigint;
  path: Path;
}
