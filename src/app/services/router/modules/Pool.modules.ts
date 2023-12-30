import { Address } from "web3"

class Pool {
    token0: Address
    token1: Address
    indexPool: number

    constructor(token0: Address, token1: Address, indexPool: number) {
        this.token0 = token0
        this.token1 = token1
        this.indexPool = indexPool
    }
}

export default Pool
