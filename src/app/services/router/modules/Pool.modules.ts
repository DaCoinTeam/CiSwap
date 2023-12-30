import { Address } from "web3"
import Pair from "./Pair.module"

class Pool {
    token0: Address
    token1: Address
    indexPool: number

    constructor(token0: Address, token1: Address, indexPool: number) {
        this.token0 = token0
        this.token1 = token1
        this.indexPool = indexPool
    }

    hasToken(token: Address): boolean {
        return token == this.token0 || token == this.token1
    }

    getPair(tokenStart: Address): Pair {
        return new Pair(
            this.token0 == tokenStart ? this.token0 : this.token1,
            this.token0 == tokenStart ? this.token1 : this.token0
        )
    }
}

export default Pool
