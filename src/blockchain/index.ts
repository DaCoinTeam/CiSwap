import { AggregatorContract, FactoryContract, PoolContract } from "./contracts"

export * from "./contracts"
export * from "./query"
export * from "./metamask"

export const blockchain = {
    contracts: {
        Aggregator: AggregatorContract,
        Factory: FactoryContract,
        PoolContract: PoolContract,
    }
}