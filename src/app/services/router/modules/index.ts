import { Address } from "web3"
import { FactoryContract, PoolContract, RouterContract } from "@blockchain"
import { ChainId } from "@config"

export interface Pair {
  token0Address: Address;
  token1Address: Address;
}

export interface Pool {
  address: Address;
  pair: Pair;
}

export interface Path {
  pools: Pool[];
  nextTokenAddress: Address;
}

export interface PathResult {
  poolAddresses: Address[];
  tokenOutAmount: bigint;
}

const arePairsEquivalent = (pair0: Pair, pair1: Pair) => {
    return (
        (pair0.token0Address == pair1.token0Address &&
      pair0.token1Address == pair1.token1Address) ||
    (pair0.token0Address == pair1.token1Address &&
      pair1.token0Address == pair0.token1Address)
    )
}

const hasPathEncounteredPair = (path: Path, pair: Pair): boolean => {
    const pathPairs: Pair[] = path.pools.map((pool) => {
        return {
            token0Address: pool.pair.token0Address,
            token1Address: pool.pair.token1Address,
        }
    })

    for (const pathPair of pathPairs) {
        if (arePairsEquivalent(pathPair, pair)) return true
    }

    return false
}

const initialize = (
    tokenInAddress: Address,
    tokenOutAddress: Address,
    allPools: Pool[],
    output: Path[]
): Path[] | null => {
    const paths: Path[] = []
    for (const pool of allPools) {
        const token0Address = pool.pair.token0Address
        const token1Address = pool.pair.token1Address

        if (tokenInAddress == token0Address || tokenInAddress == token1Address) {
            const nextTokenAddress =
        tokenInAddress == token0Address ? token1Address : token0Address
            const path: Path = {
                pools: [
                    {
                        address: pool.address,
                        pair: {
                            token0Address,
                            token1Address,
                        },
                    },
                ],
                nextTokenAddress,
            }

            if (nextTokenAddress == tokenOutAddress) {
                output.push(path)
            } else {
                paths.push(path)
            }
        }
    }
    return paths
}

const traversePaths = (
    tokenOutAddress: Address,
    allPools: Pool[],
    paths: Path[],
    output: Path[]
): Path[] | null => {
    const _paths: Path[] = []
    for (const path of paths) {
        const tokenInAddress = path.nextTokenAddress

        const pools = path.pools
        const lastPool = pools.at(-1) as Pool

        if (!lastPool) return null

        for (const pool of allPools) {
            const token0Address = pool.pair.token0Address
            const token1Address = pool.pair.token1Address
            const _pools: Pool[] = Object.assign([], pools)

            if (hasPathEncounteredPair(path, { token0Address, token1Address })) {
                continue
            }

            if (tokenInAddress == token0Address || tokenInAddress == token1Address) {
                _pools.push({
                    address: pool.address,
                    pair: {
                        token0Address,
                        token1Address,
                    },
                })

                const nextTokenAddress =
          tokenInAddress == token0Address ? token1Address : token0Address

                const _path: Path = {
                    pools: _pools,
                    nextTokenAddress,
                }

                if (nextTokenAddress == tokenOutAddress) {
                    output.push(_path)
                } else {
                    _paths.push(_path)
                }
            }
        }
    }
    return _paths
}

export const findPaths = async (
    chainId: ChainId,
    tokenInAddress: Address,
    tokenOutAddress: Address
): Promise<Path[] | null> => {
    const factoryContract = new FactoryContract(chainId)

    const poolAddresses = await factoryContract.getPools()
    if (poolAddresses == null) return null

    const pools: Pool[] = []

    const promises: Promise<void>[] = []
    for (const poolAddress of poolAddresses) {
        const promise = async () => {
            const poolContract = new PoolContract(chainId, poolAddress)
            const token0Address = await poolContract.token0()
            if (token0Address == null) return
            const token1Address = await poolContract.token1()
            if (token1Address == null) return

            pools.push({
                address: poolAddress,
                pair: {
                    token0Address,
                    token1Address,
                },
            })
        }

        promises.push(promise())
    }
    await Promise.all(promises)

    if (poolAddresses == null) return null

    const output: Path[] = []

    let paths = initialize(tokenInAddress, tokenOutAddress, pools, output)

    if (paths == null) return null
    const length = paths.length
    do {
        paths = traversePaths(tokenOutAddress, pools, paths, output)
        break
    } while (length)

    return output
}

export const findPathsOut = async (
    chainId: ChainId,
    tokenInAddress: Address,
    tokenOutAddress: Address,
    tokenInAmount: bigint
): Promise<PathResult[] | null> => {
    const result: PathResult[] = []

    const paths = await findPaths(chainId, tokenInAddress, tokenOutAddress)
    if (paths == null) return null
    const routerContract = new RouterContract(chainId)
    for (const path of paths) {
        const _path = path.pools.map((pool) => pool.address)
        const tokenOutAmount = await routerContract.getAmountsOut(
            tokenInAmount,
            tokenInAddress,
            _path
        )
        if (tokenOutAmount == null) return null
        result.push({
            poolAddresses: _path,
            tokenOutAmount,
        })
    }
    return result
}
