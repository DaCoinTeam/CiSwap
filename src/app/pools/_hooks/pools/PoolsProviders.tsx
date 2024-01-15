import {
    ERC20Contract,
    FactoryContract,
    MulticallContract,
    PoolContract,
} from "@blockchain"
import React, { createContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { chainInfos } from "@config"
import { ProvidersProps } from "@app/_shared"
import { Address } from "web3"
import { format, math } from "@utils"

interface PoolsContext {
  poolSummaries: PoolSummary[];
}

export const PoolsContext = createContext<PoolsContext | null>(null)

const PoolsProviders = (props: ProvidersProps) => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const [poolSummaries, setPoolSummaries] = useState<PoolSummary[]>([])

    useEffect(() => {
        const handleEffect = async () => {
            const factoryContract = new FactoryContract(
                chainId,
                chainInfos[chainId].factory
            )
            const pools = await factoryContract.allPools()
            if (pools === null) return

            const _poolSummaries: PoolSummary[] = []
            const promises: Promise<void>[] = []

            for (const pool of pools) {
                const promise = async () => {
                    const poolContract = new PoolContract(chainId, pool)
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

                    const multicallContract = new MulticallContract(chainId, pool)

                    const callResult = await multicallContract
                        .multicall([encodedToken0, encodedToken1, encodedIndexPool])
                        .call()

                    if (callResult === null) return

                    const token0 = format.bytesToAddress(callResult[0])
                    const token1 = format.bytesToAddress(callResult[1])

                    const token0Contract = new ERC20Contract(chainId, token0)
                    const token1Contract = new ERC20Contract(chainId, token1)

                    let decimals0: number | null = null
                    let decimals1: number | null = null

                    let symbol0: string | null = null
                    let symbol1: string | null = null

                    let balance0: bigint | null = null
                    let balance1: bigint | null = null

                    const promiseInners: Promise<void>[] = []

                    const decimals0Promise = async () => {
                        decimals0 = await token0Contract.decimals()
                    }
                    promiseInners.push(decimals0Promise())

                    const decimals1Promise = async () => {
                        decimals1 = await token1Contract.decimals()
                    }
                    promiseInners.push(decimals1Promise())

                    const symbol0Promise = async () => {
                        symbol0 = await token0Contract.symbol()
                    }
                    promiseInners.push(symbol0Promise())

                    const symbol1Promise = async () => {
                        symbol1 = await token1Contract.symbol()
                    }
                    promiseInners.push(symbol1Promise())

                    const balance0Promise = async () => {
                        balance0 = await token0Contract.balanceOf(pool)
                    }
                    promiseInners.push(balance0Promise())

                    const balance1Promise = async () => {
                        balance1 = await token1Contract.balanceOf(pool)
                    }
                    promiseInners.push(balance1Promise())

                    await Promise.all(promiseInners)

                    if (
                        decimals0 === null ||
            decimals1 === null ||
            symbol0 === null ||
            symbol1 === null ||
            balance0 === null ||
            balance1 === null
                    )
                        return

                    const poolSummary: PoolSummary = {
                        address: pool,
                        token0,
                        token1,
                        indexPool: format.bytesToNumber(callResult[2]),
                        symbol0,
                        symbol1,
                        balance0: math.blockchain.computeRedenomination(
                            balance0,
                            decimals0
                        ),
                        balance1: math.blockchain.computeRedenomination(
                            balance1,
                            decimals1
                        ),
                    }

                    _poolSummaries.push(poolSummary)
                }
                promises.push(promise())
            }

            await Promise.all(promises)
            setPoolSummaries(_poolSummaries)
        }
        handleEffect()
    }, [])

    return (
        <PoolsContext.Provider value={{ poolSummaries }}>
            {props.children}
        </PoolsContext.Provider>
    )
}

export default PoolsProviders

export interface PoolSummary {
  address: Address;
  token0: Address;
  token1: Address;
  indexPool: number;
  symbol0: string;
  symbol1: string;
  balance0: number;
  balance1: number;
}
