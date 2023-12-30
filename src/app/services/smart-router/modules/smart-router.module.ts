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
import {
    bytesToAddress,
    bytesToBigInt,
    bytesToNumber,
    findMaxBigIntIndexAndValue,
    findMinBigIntIndexAndValue,
} from "@utils"

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
        if (poolAddresses == null) return null
        if (!poolAddresses.length) throw new Error("No pool found")

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
                if (bytes == null) return
                const token0 = bytesToAddress(bytes[0])
                const token1 = bytesToAddress(bytes[1])
                const indexPool = bytesToNumber(bytes[2])
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
        let pathRests: Path[] = []
        const pathExactEnds: Path[] = []
        const pools = await this.getAllPools()
        if (pools == null) return null

        for (const pool of pools) {
            const pathCurrent = new Path()

            const createResult = pathCurrent.create(pool, tokenStart)
            if (!createResult) continue

            if (pathCurrent.getLast() == tokenEnd) {
                pathExactEnds.push(pathCurrent)
                continue
            }
            pathRests.push(pathCurrent)
        }

        let hopsCount = 0
        while (pathRests.length) {
            if (hopsCount == MAX_HOPS - 1) break

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
        if (!pathExactEnds.length) throw new Error("No path found")
        return pathExactEnds
    }

    async findBestRoute(
        amount: bigint,
        tokenStart: Address,
        tokenEnd: Address,
        exactInput: boolean
    ): Promise<BestRouteResult | null> {
        const paths = await this.getAllPaths(tokenStart, tokenEnd)
        if (paths == null) return null
        const data: Bytes[] = []
        for (const path of paths) {
            let encodedFunction: Bytes
            if (exactInput) {
                encodedFunction =
          path.steps.length == 3
              ? this.quoterContract
                  .getInstance()
                  .methods.quoteExactInputSingle(
                      amount,
                      path.getFirstPool().tokenStart,
                      path.getFirstPool().tokenEnd,
                      path.getFirstPool().indexPool
                  )
                  .encodeABI()
              : this.quoterContract
                  .getInstance()
                  .methods.quoteExactInput(amount, path.encodePacked())
                  .encodeABI()
            } else {
                encodedFunction =
          path.steps.length == 3
              ? this.quoterContract
                  .getInstance()
                  .methods.quoteExactOutputSingle(
                      amount,
                      path.getFirstPool().tokenStart,
                      path.getFirstPool().tokenEnd,
                      path.getFirstPool().indexPool
                  )
                  .encodeABI()
              : this.quoterContract
                  .getInstance()
                  .methods.quoteExactOutput(amount, path.reverse().encodePacked())
                  .encodeABI()
            }

            data.push(encodedFunction)
        }
        const bytes = await this.multicallContract.multicall(data).call()
        if (bytes == null) return null

        const amountsQuoted = bytes.map((byte) => bytesToBigInt(byte))

        const { index, value } = exactInput
            ? findMaxBigIntIndexAndValue(amountsQuoted)
            : findMinBigIntIndexAndValue(amountsQuoted)

        return {
            path: paths[index].steps,
            amount: value,
        }
    }
}
export default SmartRouter

export interface BestRouteResult {
  amount: bigint;
  path: (Address | number)[];
}
