import web3, { Address, Bytes } from "web3"
import {
    FactoryContract,
    PoolContract,
    QuoterContract,
} from "@blockchain"
import { ChainId } from "@config"
import {
    BigIntElement,
    findMaxBigIntIndexAndValue,
    findMinBigIntIndexAndValue,
} from "@utils"

export interface PoolInfo {
  token0: Address;
  token1: Address;
  indexPool: bigint;
}

const getAllPoolInfos = async (
    chainId: ChainId
): Promise<PoolInfo[] | null> => {
    const factory = new FactoryContract(chainId)

    const poolInfos: PoolInfo[] = []

    const allPools = await factory.allPools()
    if (allPools == null) return null
    for (const pool of allPools) {
        const poolContract = new PoolContract(chainId, pool)
        const token0 = await poolContract.token0()
        if (token0 == null) return null
        const token1 = await poolContract.token1()
        if (token1 == null) return null
        const indexPool = await poolContract.indexPool()
        if (indexPool == null) return null
        poolInfos.push({
            token0,
            token1,
            indexPool,
        })
    }

    return poolInfos
}

const arePoolsEquivalent = (poolInfo0: PoolInfo, poolInfo1: PoolInfo) => {
    const hasSameTokens =
    (poolInfo0.token0 == poolInfo1.token1 &&
      poolInfo0.token1 == poolInfo1.token0) ||
    (poolInfo0.token0 == poolInfo1.token0 &&
      poolInfo0.token1 == poolInfo1.token1)
    return hasSameTokens && poolInfo0.indexPool == poolInfo1.indexPool
}

export interface PoolSwapInfo {
  tokenStart: Address;
  tokenEnd: Address;
  indexPool: bigint;
}

const convert = (info: PoolSwapInfo): PoolInfo => {
    const zeroForOne =
    web3.utils.stringToHex(info.tokenStart) <
    web3.utils.stringToHex(info.tokenEnd)
    return {
        token0: zeroForOne ? info.tokenStart : info.tokenEnd,
        token1: zeroForOne ? info.tokenEnd : info.tokenStart,
        indexPool: info.indexPool,
    }
}

export type Path = (Address | bigint)[];

const encodePath = (path: Path): Bytes => {
    return web3.utils.encodePacked(path)
}

const hasPathEncounteredPool = (
    path: Path,
    indexPool: bigint,
    token: Address
): boolean => {
    const length = path.length
    if (length < 3) {
        throw new Error("Path length must be at least 3")
    }
    const poolSwapInfoNext: PoolSwapInfo = {
        tokenStart: path[length - 1] as Address,
        indexPool,
        tokenEnd: token,
    }
    for (let i = 0; i < length - 2; i++) {
        const poolSwapInfo: PoolSwapInfo = {
            tokenStart: path[i] as Address,
            indexPool: path[i + 1] as bigint,
            tokenEnd: path[i + 2] as Address,
        }
        if (arePoolsEquivalent(convert(poolSwapInfoNext), convert(poolSwapInfo)))
            return true
    }
    return false
}

const pushPoolToPath = (path: Path, indexPool: bigint, token: Address) =>
    path.push(indexPool, token)

const initialize = (
    tokenStart: Address,
    tokenEnd: Address,
    allPoolInfos: PoolInfo[],
    output: Path[]
): Path[] => {
    const paths: Path[] = []
    for (const poolInfo of allPoolInfos) {
        if (tokenStart == poolInfo.token0 || tokenStart == poolInfo.token1) {
            const tokenEndPaired =
        tokenStart == poolInfo.token0 ? poolInfo.token1 : poolInfo.token0
            const path: Path = [tokenStart, poolInfo.indexPool, tokenEndPaired]

            if (tokenEndPaired == tokenEnd) {
                output.push(path)
            } else {
                paths.push(path)
            }
        }
    }
    return paths
}

const traversePaths = (
    tokenEnd: Address,
    allPoolInfos: PoolInfo[],
    paths: Path[],
    output: Path[]
): Path[] | null => {
    const returnPaths: Path[] = []
    for (const path of paths) {
        const tokenStart = path.at(-1)

        for (const poolInfo of allPoolInfos) {
            const tokenEndPaired =
        poolInfo.token0 == tokenStart ? poolInfo.token1 : poolInfo.token0
            if (hasPathEncounteredPool(path, poolInfo.indexPool, tokenEndPaired))
                continue

            if (
                tokenEndPaired == poolInfo.token0 ||
        tokenEndPaired == poolInfo.token1
            ) {
                const tokenEndNext =
          tokenEndPaired == poolInfo.token0 ? poolInfo.token1 : poolInfo.token0
                pushPoolToPath(path, poolInfo.indexPool, tokenEndNext)

                if (tokenEndNext == tokenEnd) {
                    output.push(path)
                } else {
                    returnPaths.push(path)
                }
            }
        }
    }
    return returnPaths
}

export interface OptimalResult {
  amountQuoted: bigint;
  path: Path;
}

const getOptimalResult = async (
    chainId: ChainId,
    amount: bigint,
    paths: Path[],
    exactInput: boolean
): Promise<OptimalResult | null> => {
    if (!paths.length) throw new Error("Paths array is empty")

    const quoterContract = new QuoterContract(chainId)
    const amounts: bigint[] = []
    for (const path of paths) {
        const encodedPath = encodePath(path)
        let amountQuoted: bigint
        if (exactInput) {
            const amountOut = await quoterContract.quoteExactInput(
                amount,
                encodedPath
            )
            if (amountOut == null) return null
            amountQuoted = amountOut
        } else {
            const amountIn = await quoterContract.quoteExactOutput(
                amount,
                encodedPath
            )
            if (amountIn == null) return null
            amountQuoted = amountIn
        }
        amounts.push(amountQuoted)
    }
    const element: BigIntElement = exactInput
        ? findMaxBigIntIndexAndValue(amounts)
        : findMinBigIntIndexAndValue(amounts)
    return {
        amountQuoted: element.value,
        path: paths[element.index],
    }
}

export const findOptimalResult = async (
    chainId: ChainId,
    tokenStart: Address,
    tokenEnd: Address,
    amount: bigint,
    exactInput: boolean
): Promise<OptimalResult | null> => {
    const allPoolInfos = await getAllPoolInfos(chainId)
    if (allPoolInfos == null) return null
    const output: Path[] = []
    const paths = initialize(tokenStart, tokenEnd, allPoolInfos, output)
    while (paths.length) {
        traversePaths(tokenEnd, allPoolInfos, paths, output)
    }
    return await getOptimalResult(chainId, amount, output, exactInput)
}
