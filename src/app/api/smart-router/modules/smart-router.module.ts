import {
    QuoterContract,
    FactoryContract,
    PoolContract,
    MulticallContract,
} from "@blockchain"
import { ChainId, chainInfos } from "@config"
import { Address, Bytes } from "web3"
import Path from "./path.module"
import Pool from "./pool.module"
import { Quote, QuoteType } from "@services"
import utils from "@utils"

const MAX_HOPS = 2

class SmartRouter {
    private chainId: ChainId
    private factoryContract: FactoryContract
    private quoterContract: QuoterContract
    private multicallContract: MulticallContract

    constructor(chainId: ChainId) {
        this.chainId = chainId
        this.factoryContract = new FactoryContract(
            this.chainId,
            chainInfos[chainId].factory
        )
        this.quoterContract = new QuoterContract(
            this.chainId,
            chainInfos[chainId].quoter
        )
        this.multicallContract = new MulticallContract(
            this.chainId,
            chainInfos[chainId].quoter
        )
    }

    private async getAllPools(): Promise<Pool[] | null> {
        const poolAddresses = await this.factoryContract.allPools()
        if (poolAddresses === null) return null
        if (!poolAddresses.length) throw new Error("No pool found.")

        const pools: Pool[] = []
        const promises: Promise<void>[] = []
        for (const poolAddress of poolAddresses) {
            const promise = async () => {
                const multicallContract = new MulticallContract(
                    this.chainId,
                    poolAddress
                )
                const poolContract = new PoolContract(this.chainId, poolAddress)
                const encodedToken0 = poolContract
                    .getInstance()
                    .methods.token0()
                    .encodeABI()
                const encodedToken1 = poolContract
                    .getInstance()
                    .methods.token1()
                    .encodeABI()
                const encodedIndexPool = poolContract
                    .getInstance()
                    .methods.indexPool()
                    .encodeABI()
                const bytes = await multicallContract
                    .multicall([encodedToken0, encodedToken1, encodedIndexPool])
                    .call()
                if (bytes === null) return
                const token0 = utils.web3.bytesToAddress(bytes[0])
                const token1 = utils.web3.bytesToAddress(bytes[1])
                const indexPool = utils.web3.bytesToNumber(bytes[2])
                pools.push(new Pool(token0, token1, indexPool))
            }
            promises.push(promise())
        }
        await Promise.all(promises)
        return pools
    }

    private async computeAllPaths(
        tokenStart: Address,
        tokenEnd: Address
    ): Promise<Path[] | null> {
        let pathRests: Path[] = []
        const pathExactEnds: Path[] = []
        const pools = await this.getAllPools()
        if (pools === null) return null

        for (const pool of pools) {
            const pathCurrent = new Path()

            const createResult = pathCurrent.create(pool, tokenStart)
            if (!createResult) continue

            if (pathCurrent.getLast() === tokenEnd) {
                pathExactEnds.push(pathCurrent)
                continue
            }
            pathRests.push(pathCurrent)
        }

        let hopsCount = 0
        while (pathRests.length) {
            if (hopsCount === MAX_HOPS - 1) break

            const pathRestsTemp: Path[] = []

            for (const pathRest of pathRests) {
                const { pathExactEnds: _pathExactEnds, pathRests: _pathRests } =
          pathRest.generatePathsFromNextHop(pools, tokenEnd)

                pathExactEnds.push(..._pathExactEnds)
                pathRestsTemp.push(..._pathRests)
            }
            pathRests = pathRestsTemp

            hopsCount++
        }
        if (!pathExactEnds.length) throw new Error("No path found.")
        return pathExactEnds
    }

    async findBestQuote(
        amount: bigint,
        tokenIn: Address,
        tokenOut: Address,
        exactInput?: boolean
    ): Promise<Quote | null> {
        exactInput = exactInput ?? false

        const paths = await this.computeAllPaths(tokenIn, tokenOut)
        if (paths === null) return null

        const data: Bytes[] = []
        const exactInputs: boolean[] = []

        for (const path of paths) {
            const has3Steps = path.steps.length === 3

            const quoteTypeInput = has3Steps
                ? QuoteType.ExactInputSingle
                : QuoteType.ExactInput
            const quoteTypeOutput = has3Steps
                ? QuoteType.ExactOutputSingle
                : QuoteType.ExactOutput
            const quoteType = exactInput ? quoteTypeInput : quoteTypeOutput
            exactInputs.push(exactInput)

            const quoteTypeToEncodedFunction: Record<QuoteType, Bytes> = {
                [QuoteType.ExactInputSingle]: this.quoterContract
                    .getInstance()
                    .methods.quoteExactInputSingle(
                        amount,
                        path.getFirstPool().tokenStart,
                        path.getFirstPool().tokenEnd,
                        path.getFirstPool().indexPool
                    )
                    .encodeABI(),
                [QuoteType.ExactInput]: this.quoterContract
                    .getInstance()
                    .methods.quoteExactInput(amount, path.encodePacked())
                    .encodeABI(),
                [QuoteType.ExactOutputSingle]: this.quoterContract
                    .getInstance()
                    .methods.quoteExactOutputSingle(
                        amount,
                        path.getFirstPool().tokenStart,
                        path.getFirstPool().tokenEnd,
                        path.getFirstPool().indexPool
                    )
                    .encodeABI(),
                [QuoteType.ExactOutput]: this.quoterContract
                    .getInstance()
                    .methods.quoteExactOutput(amount, path.reverse().encodePacked())
                    .encodeABI(),
            }

            const encodedFunction = quoteTypeToEncodedFunction[quoteType]

            data.push(encodedFunction)
        }
        const bytes = await this.multicallContract.multicall(data).call()
        if (bytes === null) return null

        const amountsQuoted = bytes.map((byte) => utils.web3.bytesToBigInt(byte))

        const { index, value } = exactInput
            ? utils.array.findMaxBigIntIndexAndValue(amountsQuoted)
            : utils.array.findMinBigIntIndexAndValue(amountsQuoted)

        const amountIn = exactInput ? amount : value
        const amountOut = exactInput ? value : amount
        
        return new Quote(amountIn, amountOut, paths[index].steps, exactInputs[index])

    }
}
export default SmartRouter
