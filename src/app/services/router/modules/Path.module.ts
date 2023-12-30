import web3, { Address, Bytes } from "web3"
import Pair from "./Pair.module"
import Pool from "./Pool.modules"
class Path {
    private steps: (Address | number)[]
    constructor(steps?: (Address | number)[]) {
        this.steps = steps ?? []
    }

    toPackedBytes(): Bytes {
        return web3.utils.encodePacked(this.steps)
    }

    private hasEncounteredPair(token: Address): boolean {
        const length = this.steps.length
        if (length < 3) {
            throw new Error("Path length must be at least 3")
        }

        const pairNext = new Pair(this.steps.at(-1) as Address, token)

        for (let i = 0; i < (length - 1) / 2; i++) {
            const pairCurrent = new Pair(
        this.steps[2 * i] as Address,
        this.steps[2 * i + 2] as Address
            )

            if (pairCurrent.compare(pairNext)) return true
        }
        return false
    }

    getLast(): Address {
        return this.steps.at(-1) as Address
    }

    create(pool: Pool, tokenStart: Address): boolean {
        if (!pool.hasToken(tokenStart)) return false
        const pair = pool.getPair(tokenStart)

        this.steps.push(pair.tokenStart, pool.indexPool, pair.tokenEnd)
        return true
    }

    addNextHop(indexPool: number, token: Address): boolean {
        if (this.hasEncounteredPair(token)) return false
        this.steps.push(indexPool, token)
        return true
    }
    generatePathsFromNextHop(
        pools: Pool[],
        tokenEnd: Address
    ): {
    exactEndPaths: Path[];
    restPaths: Path[];
  } {
        const exactEndPaths: Path[] = []
        const restPaths: Path[] = []
        const tokenStart = this.steps.at(-1) as Address

        for (const pool of pools) {
            if (!pool.hasToken(tokenStart)) continue
            const tokenEndPaired =
        pool.token0 === tokenStart ? pool.token1 : pool.token0
            const pathCurrent = new Path(this.steps)
            const addResult = pathCurrent.addNextHop(pool.indexPool, tokenEndPaired)
            if (!addResult) continue
            if (tokenEndPaired == tokenEnd) {
                exactEndPaths.push(pathCurrent)
                continue
            }
            restPaths.push(pathCurrent)
        }
        return { exactEndPaths, restPaths }
    }
}
export default Path
