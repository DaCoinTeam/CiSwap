import { QuoterContract, FactoryContract, PoolContract } from "@blockchain"
import { ChainId } from "@config"
import { Address } from "web3"
import Path from "./Path.module"
import Pool from "./Pool.modules"

const MAX_HOPS = 2

class Router {
    private chainId: ChainId
    private factoryContract: FactoryContract
    private quoterContract: QuoterContract

    constructor(chainId: ChainId) {
        this.chainId = chainId
        this.factoryContract = new FactoryContract(this.chainId)
        this.quoterContract = new QuoterContract(this.chainId)
    }

    async getAllPools(): Promise<Pool[] | null> {
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

    async getAllPaths(
        tokenStart: Address,
        tokenEnd: Address
    ): Promise<Path[] | null> {
        let exactEndPaths: Path[] = []
        let restPaths: Path[] = []
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

        while (restPaths.length) {
            const exactEndPathsTemp: Path[] = []
            const restPathsTemp: Path[] = []

            for (const restPath of restPaths) {
                const { exactEndPaths: _exactEndPaths, restPaths: _restPaths } =
          restPath.generatePathsFromNextHop(pools, tokenEnd)
                exactEndPathsTemp.push(..._exactEndPaths)
                restPathsTemp.push(..._restPaths)
            }
            exactEndPaths = exactEndPathsTemp
            restPaths = restPathsTemp
        }

        return exactEndPaths
    }
}
export default Router