import { Address, Bytes, Sha3Input, utils } from "web3"
import Pair from "./pair.module"
import Pool from "./pool.module"

class Path {
    steps: Step[]
    constructor(steps?: Step[]) {
        this.steps = steps ?? []
    }

    encodePacked(): Bytes {
        const inputs: Sha3Input[] = this.steps.map((step) => {
            if (typeof step === "number") {
                return { type: "uint32", value: step }
            }
            return { type: "address", value: step }
        })
        return utils.encodePacked(...inputs)
    }

    getFirstPool(): {
    tokenStart: Address;
    tokenEnd: Address;
    indexPool: number;
    } {
        return {
            tokenStart: this.steps[0] as Address,
            tokenEnd: this.steps[2] as Address,
            indexPool: this.steps[1] as number,
        }
    }

    private hasEncounteredPair(tokenNext: Address): boolean {
        const length = this.steps.length
        if (length < 3) {
            throw new Error("Path length must be at least 3")
        }

        const pairNext = new Pair(this.steps.at(-1) as Address, tokenNext)

        for (let i = 0; i < (length - 1) / 2; i++) {
            const pairCurrent = new Pair(
        this.steps[2 * i] as Address,
        this.steps[2 * i + 2] as Address
            )

            if (pairCurrent.compare(pairNext)) return true
        }
        return false
    }

    reverse(): Path {
        return new Path(this.steps.slice().reverse())
    }

    getLast(): Address {
        return this.steps.at(-1) as Address
    }

    create(pool: Pool, tokenStart: Address): boolean {
        const pair = pool.getPair(tokenStart)
        if (pair === null) return false

        this.steps.push(pair.tokenStart, pool.indexPool, pair.tokenEnd)
        return true
    }

    pushNextHop(indexPool: number, token: Address): boolean {
        if (this.hasEncounteredPair(token)) return false
        this.steps.push(indexPool, token)
        return true
    }

    generatePathsFromNextHop(
        pools: Pool[],
        tokenEnd: Address
    ): {
    pathExactEnds: Path[];
    pathRests: Path[];
  } {
        const pathExactEnds: Path[] = []
        const pathRests: Path[] = []
        const tokenStart = this.steps.at(-1) as Address

        for (const pool of pools) {
            const pair = pool.getPair(tokenStart)
            if (pair === null) continue

            const steps = this.steps.slice()
            const pathCurrent = new Path(steps)

            const pushResult = pathCurrent.pushNextHop(pool.indexPool, pair.tokenEnd)

            if (!pushResult) continue
            if (pair.tokenEnd === tokenEnd) {
                pathExactEnds.push(pathCurrent)
                continue
            }

            pathRests.push(pathCurrent)
        }
        return { pathExactEnds, pathRests }
    }
}

export type Step = Address | number;

export default Path
