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
        const exactEndPaths: Path[] = []
        const restPaths: Path[] = []
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

        return exactEndPaths
    }
}
export default Router

// import web3, { Address, Bytes } from "web3"
// import { FactoryContract, PoolContract, QuoterContract } from "@blockchain"
// import { ChainId } from "@config"
// import {
//     BigIntElement,
//     findMaxBigIntIndexAndValue,
//     findMinBigIntIndexAndValue,
// } from "@utils"

// export interface PoolInfo {
//   token0: Address;
//   token1: Address;
//   indexPool: bigint;
// }

// const getAllPoolInfos = async (
//     chainId: ChainId
// ): Promise<PoolInfo[] | null> => {
//     const factory = new FactoryContract(chainId)

//     const poolInfos: PoolInfo[] = []

//     const allPools = await factory.allPools()
//     if (allPools == null) return null

//     const promises: Promise<void>[] = []
//     for (const pool of allPools) {
//         const poolContract = new PoolContract(chainId, pool)
//         const promise = async () => {
//             const token0 = await poolContract.token0()
//             if (token0 == null) return
//             const token1 = await poolContract.token1()
//             if (token1 == null) return
//             const indexPool = await poolContract.indexPool()
//             if (indexPool == null) return
//             poolInfos.push({
//                 token0,
//                 token1,
//                 indexPool,
//             })
//         }
//         promises.push(promise())
//     }
//     await Promise.all(promises)
//     return poolInfos
// }

// const arePoolsEquivalent = (poolInfo0: PoolInfo, poolInfo1: PoolInfo) => {
//     return (
//         (poolInfo0.token0 == poolInfo1.token1 &&
//       poolInfo0.token1 == poolInfo1.token0) ||
//     (poolInfo0.token0 == poolInfo1.token0 &&
//       poolInfo0.token1 == poolInfo1.token1)
//     )
// }

// export interface PathwayPoolInfo {
//   tokenStart: Address;
//   tokenEnd: Address;
//   indexPool: bigint;
// }

// const convert = (info: PathwayPoolInfo): PoolInfo => {
//     const zeroForOne =
//     web3.utils.stringToHex(info.tokenStart) <
//     web3.utils.stringToHex(info.tokenEnd)
//     return {
//         token0: zeroForOne ? info.tokenStart : info.tokenEnd,
//         token1: zeroForOne ? info.tokenEnd : info.tokenStart,
//         indexPool: info.indexPool,
//     }
// }

// export type Path = (Address | bigint)[];

// const encodePath = (path: Path): Bytes => {
//     return web3.utils.encodePacked(path)
// }

// const hasPathEncounteredPool = (
//     path: Path,
//     indexPool: bigint,
//     token: Address
// ): boolean => {
//     const length = path.length
//     if (length < 3) {
//         throw new Error("Path length must be at least 3")
//     }
//     const pathwayPoolInfoNext: PathwayPoolInfo = {
//         tokenStart: path.at(-1) as Address,
//         tokenEnd: token,
//         indexPool,
//     }
//     for (let i = 0; i < (length - 1) / 2; i++) {
//         const pathwayPoolInfo: PathwayPoolInfo = {
//             tokenStart: path[2 * i] as Address,
//             indexPool: path[2 * i + 1] as bigint,
//             tokenEnd: path[2 * i + 2] as Address,
//         }
//         if (
//             arePoolsEquivalent(convert(pathwayPoolInfo), convert(pathwayPoolInfoNext))
//         )
//             return true
//     }
//     return false
// }

// const pushPoolToPath = (path: Path, indexPool: bigint, token: Address) =>
//     path.push(indexPool, token)

// const hasToken = (poolInfo: PoolInfo, tokenStart: Address): boolean => {
//     return tokenStart == poolInfo.token0 || tokenStart == poolInfo.token1
// }

// const initialize = (
//     tokenStart: Address,
//     tokenEnd: Address,
//     allPoolInfos: PoolInfo[],
//     output: Path[]
// ): Path[] => {
//     const paths: Path[] = []
//     for (const poolInfo of allPoolInfos) {
//         if (!hasToken(poolInfo, tokenStart)) continue

//         const tokenEndPaired =
//       tokenStart == poolInfo.token0 ? poolInfo.token1 : poolInfo.token0
//         const path: Path = [tokenStart, poolInfo.indexPool, tokenEndPaired]
//         console.log(tokenEnd + "---" + tokenEndPaired)
//         if (tokenEndPaired == tokenEnd) {
//             output.push(path)
//         } else {
//             paths.push(path)
//         }
//     }
//     return paths
// }

// const traversePaths = (
//     tokenEnd: Address,
//     allPoolInfos: PoolInfo[],
//     paths: Path[],
//     output: Path[]
// ): Path[] | null => {
//     const returnPaths: Path[] = []
//     for (const path of paths) {
//         const tokenStart = path.at(-1) as Address

//         for (const poolInfo of allPoolInfos) {
//             if (!hasToken(poolInfo, tokenStart)) continue

//             const tokenEndPaired =
//         poolInfo.token0 == tokenStart ? poolInfo.token1 : poolInfo.token0
//             console.log(
//                 hasPathEncounteredPool(path, poolInfo.indexPool, tokenEndPaired)
//             )
//             if (hasPathEncounteredPool(path, poolInfo.indexPool, tokenEndPaired))
//                 continue

//             if (
//                 tokenEndPaired == poolInfo.token0 ||
//         tokenEndPaired == poolInfo.token1
//             ) {
//                 const tokenEndNext =
//           tokenEndPaired == poolInfo.token0 ? poolInfo.token1 : poolInfo.token0
//                  console.log("Cuong" + path)
//                 pushPoolToPath(path, poolInfo.indexPool, tokenEndNext)
//                 console.log("Thinh" + path)
//                 if (tokenEndNext == tokenEnd) {
//                     output.push(path)
//                 } else {
//                     returnPaths.push(path)
//                 }
//             }
//         }
//     }
//     return returnPaths
// }

// export interface OptimalResult {
//   amountQuoted: bigint;
//   path: Path;
// }

// const getOptimalResult = async (
//     chainId: ChainId,
//     amount: bigint,
//     paths: Path[],
//     exactInput: boolean
// ): Promise<OptimalResult | null> => {
//     if (!paths.length) throw new Error("Paths array is empty")

//     const quoterContract = new QuoterContract(chainId)
//     const amounts: bigint[] = []
//     for (const path of paths) {
//         const encodedPath = encodePath(path)
//         let amountQuoted: bigint
//         if (exactInput) {
//             const amountOut = await quoterContract.quoteExactInput(
//                 amount,
//                 encodedPath
//             )
//             if (amountOut == null) return null
//             amountQuoted = amountOut
//         } else {
//             const amountIn = await quoterContract.quoteExactOutput(
//                 amount,
//                 encodedPath
//             )
//             if (amountIn == null) return null
//             amountQuoted = amountIn
//         }
//         amounts.push(amountQuoted)
//     }
//     const element: BigIntElement = exactInput
//         ? findMaxBigIntIndexAndValue(amounts)
//         : findMinBigIntIndexAndValue(amounts)
//     return {
//         amountQuoted: element.value,
//         path: paths[element.index],
//     }
// }

// export const findOptimalResult = async (
//     chainId: ChainId,
//     tokenStart: Address,
//     tokenEnd: Address,
//     amount: bigint,
//     exactInput: boolean
// ): Promise<OptimalResult | null> => {
//     const allPoolInfos = await getAllPoolInfos(chainId)
//     if (allPoolInfos == null) return null
//     const output: Path[] = []
//     let paths = initialize(tokenStart, tokenEnd, allPoolInfos, output)
//     while (paths.length) {
//         paths = traversePaths(tokenEnd, allPoolInfos, paths, output)
//         break
//     }
//     console.log(paths)
//     return null
//     //return await getOptimalResult(chainId, amount, output, exactInput)
// }
