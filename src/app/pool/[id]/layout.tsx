"use client"
import { RootState } from "@redux"
import React, { ReactNode, createContext, useEffect, useMemo, useReducer } from "react"
import { useSelector } from "react-redux"
import { TokenState, initialTokenState, tokenReducer } from "./_hooks"
import { useParams } from "next/navigation"
import { calculateRedenomination, fetchAndCreateSvgBlobUrl } from "@utils"
import { ERC20Contract, LiquidityPoolContract } from "@blockchain"
import { chainInfos } from "@config"
import { getTokenApi } from "@api"

interface PoolContext {
    tokenState: TokenState,
    handlers: {
        _handleWithoutConnected: () => Promise<void>;
        _handleWithConnected: () => Promise<void>;
        _handleAll: () => Promise<void>;
    }, 
    poolAddress: string
}

export const PoolContext = createContext<PoolContext|null>(null)

const RootLayout = ({ children }: { children: ReactNode }) => {
    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )
    const account = useSelector((state: RootState) => state.blockchain.account)

    const [tokenState, tokenDispatch] = useReducer(
        tokenReducer,
        initialTokenState
    )

    console.log(tokenState)

    const params = useParams()
    const poolAddress = params.id as string

    const _handleWithoutConnected = async () => {
        
        const poolContract = new LiquidityPoolContract(chainName, poolAddress)

        const _handleToken0Promises = async () => {
            const token0Address = await poolContract.token0()
            if (token0Address == null) return
            tokenDispatch({ type: "SET_TOKEN0_ADDRESS", payload: token0Address })

            const token0Contract = new ERC20Contract(chainName, token0Address) 

            const token0Decimals = await token0Contract.decimals()
            if (token0Decimals == null) return
            tokenDispatch({ type: "SET_TOKEN0_DECIMALS", payload: token0Decimals })


            const token0Promises : Promise<void>[] = []

            const handleTokenDTO = async () => {
                const token0DTO = await getTokenApi(token0Address, chainInfos[chainName].chainId)
                if (token0DTO != null)
                {
                    const blobUrl = await fetchAndCreateSvgBlobUrl(token0DTO.tokenImageUrl)
                    if (blobUrl == null) return
                    tokenDispatch({ type: "SET_TOKEN1_IMAGE_URL", payload: blobUrl })
                }
            }
            token0Promises.push(handleTokenDTO())

            const handleToken0Symbol = async () => {
                const token0Symbol = await token0Contract.symbol()
                if (token0Symbol == null) return
                tokenDispatch({ type: "SET_TOKEN0_SYMBOL", payload: token0Symbol })
            }
            token0Promises.push(handleToken0Symbol())

            const handleToken0Locked = async () => {
                const token0Locked = await token0Contract.balanceOf(poolAddress)
                if (token0Locked == null) return
                tokenDispatch({
                    type: "SET_TOKEN0_LOCKED",
                    payload: calculateRedenomination(token0Locked, token0Decimals, 3),
                })
            }
            token0Promises.push(handleToken0Locked())
            
            const handleToken0Price = async () => {
                const token0Price = await poolContract.token0Price()
                if (token0Price == null) return
                tokenDispatch({
                    type: "SET_TOKEN0_PRICE",
                    payload: calculateRedenomination(token0Price, token0Decimals, 3),
                })
            }
            token0Promises.push(handleToken0Price())

            const handleToken0BasePrice = async () => {
                const token0MaxPrice = await poolContract.token0MaxPrice()
                if (token0MaxPrice == null) return
                tokenDispatch({
                    type: "SET_TOKEN0_MAX_PRICE",
                    payload: calculateRedenomination(token0MaxPrice, token0Decimals, 3),
                })
            }
            token0Promises.push(handleToken0BasePrice())

            const handleToken0MaxPrice = async () => {
                const token0BasePrice = await poolContract.token0BasePrice()
                if (token0BasePrice == null) return
                tokenDispatch({
                    type: "SET_TOKEN0_BASE_PRICE",
                    payload: calculateRedenomination(token0BasePrice, token0Decimals, 3),
                })
        
            }
            token0Promises.push(handleToken0MaxPrice())
            await Promise.all(token0Promises)
        
        
        }

        const _handleToken1Promises = async () => {
            const token1Address = await poolContract.token1()
            if (token1Address == null) return
            tokenDispatch({ type: "SET_TOKEN1_ADDRESS", payload: token1Address })
        
            const token1Contract = new ERC20Contract(chainName, token1Address)

            const token1Decimals = await token1Contract.decimals()
            if (token1Decimals == null) return
            tokenDispatch({ type: "SET_TOKEN1_DECIMALS", payload: token1Decimals })

            const token1Promises : Promise<void>[] = []

            const handleToken1DTO = async () => {
                const token1DTO = await getTokenApi(token1Address, chainInfos[chainName].chainId)
                if (token1DTO != null)
                {
                    const blobUrl = await fetchAndCreateSvgBlobUrl(token1DTO.tokenImageUrl)
                    if (blobUrl == null) return
                    tokenDispatch({ type: "SET_TOKEN1_IMAGE_URL", payload: blobUrl })
                }
            }
            token1Promises.push(handleToken1DTO())

            const handleToken1Symbol = async () => {
                const token1Symbol = await token1Contract.symbol()
                if (token1Symbol == null) return
                tokenDispatch({ type: "SET_TOKEN1_SYMBOL", payload: token1Symbol })
            } 
            token1Promises.push(handleToken1Symbol())
            
            const handleToken1Locked = async () => {
                const token1Locked = await token1Contract.balanceOf(poolAddress)
                if (token1Locked == null) return
                tokenDispatch({
                    type: "SET_TOKEN1_LOCKED",
                    payload: calculateRedenomination(token1Locked, token1Decimals, 3),
                })
            }
            token1Promises.push(handleToken1Locked())

            const handleToken1Price = async () => {
                const token1Price = await poolContract.token1Price()
                if (token1Price == null) return
                tokenDispatch({
                    type: "SET_TOKEN1_PRICE",
                    payload: calculateRedenomination(token1Price, token1Decimals, 3),
                })
            }
            token1Promises.push(handleToken1Price())

            await Promise.all(token1Promises)
        }

        const _handleLPTokenPromises = async () => {
            const LPTokenDecimals = await poolContract.decimals()
            if (LPTokenDecimals == null) return
            tokenDispatch({
                type: "SET_LP_TOKEN_DECIMALS",
                payload: LPTokenDecimals,
            })

            const LPTokenPromises : Promise<void>[] = []

            const handleLPTokenSymbol = async () => {
                const LPTokenSymbol = await poolContract.symbol()
                if (LPTokenSymbol == null) return
                tokenDispatch({
                    type: "SET_LP_TOKEN_SYMBOL",
                    payload: LPTokenSymbol,
                })
            }
            LPTokenPromises.push(handleLPTokenSymbol())
            
            const handleLPTokenTotalSupply = async () => {
                const LPTokenTotalSupply = await poolContract.totalSupply()
                if (LPTokenTotalSupply == null) return
                tokenDispatch({
                    type: "SET_LP_TOKEN_TOTAL_SUPPLY",
                    payload: calculateRedenomination(LPTokenTotalSupply, LPTokenDecimals, 3),
                })
            }
            LPTokenPromises.push(handleLPTokenTotalSupply())

            const handleLPTokenAmountLocked = async () => {
                const LPTokenAmountLocked = await poolContract.balanceOf(poolAddress)
                if (LPTokenAmountLocked == null) return
                tokenDispatch({
                    type: "SET_LP_TOKEN_AMOUNT_LOCKED",
                    payload: calculateRedenomination(LPTokenAmountLocked, LPTokenDecimals, 3),
                })
            }
            LPTokenPromises.push(handleLPTokenAmountLocked())

            await Promise.all(LPTokenPromises)
        }
       
        const promises : Promise<void>[] = []
        promises.push(_handleToken0Promises())
        promises.push(_handleToken1Promises())
        promises.push(_handleLPTokenPromises())
        await Promise.all(promises)

        tokenDispatch({
            type: "SET_FINISH_LOAD_WITHOUT_CONNECTED",
            payload: true,
        })
    }

    useEffect(() => {
        _handleWithoutConnected()
    }, [])

    const _handleWithConnected = async () => {
        if (!account || !tokenState.finishLoadWithoutConnected) {
            tokenDispatch({
                type: "SET_TOKEN0_BALANCE",
                payload: 0,
            })

            tokenDispatch({
                type: "SET_TOKEN1_BALANCE",
                payload: 0,
            })

            tokenDispatch({
                type: "SET_LP_TOKEN_BALANCE",
                payload: 0,
            })

            tokenDispatch({
                type: "SET_FINISH_LOAD_WITH_CONNECTED",
                payload: false,
            })
            return
        }

        const poolContract = new LiquidityPoolContract(chainName, poolAddress)
        const token0Contract = new ERC20Contract(
            chainName,
            tokenState.token0Address
        )
        const token1Contract = new ERC20Contract(
            chainName,
            tokenState.token1Address
        )

        const promises : Promise<void>[] = []

        const handleToken0Balance = async () => {
            const token0Balance = await token0Contract.balanceOf(account)
            if (token0Balance == null) return
            tokenDispatch({
                type: "SET_TOKEN0_BALANCE",
                payload: calculateRedenomination(
                    token0Balance,
                    tokenState.token0Decimals,
                    3
                ),
            })
        }
        promises.push(handleToken0Balance())

        const handleToken1Balance = async () => {
            const token1Balance = await token1Contract.balanceOf(account)
            if (token1Balance == null) return
            tokenDispatch({
                type: "SET_TOKEN1_BALANCE",
                payload: calculateRedenomination(
                    token1Balance,
                    tokenState.token1Decimals,
                    3
                ),
            })
        }
        promises.push(handleToken1Balance())

        const handleLPTokenBalance = async () => {
            const LPTokenBalance = await poolContract.balanceOf(account)
            if (LPTokenBalance == null) return
            tokenDispatch({
                type: "SET_LP_TOKEN_BALANCE",
                payload: calculateRedenomination(
                    LPTokenBalance,
                    tokenState.token0Decimals,
                    3
                ),
            })
            tokenDispatch({ type: "SET_FINISH_LOAD_WITH_CONNECTED", payload: true })
        }
        promises.push(handleLPTokenBalance())

        await Promise.all(promises)
    }


    useEffect(() => {
        _handleWithConnected()
    }, [account, tokenState.finishLoadWithoutConnected])

    const _handleAll = async () => {
        await _handleWithoutConnected()
        await _handleWithConnected()
    }
    
    const handlers = useMemo(() => {
        return { _handleWithoutConnected, _handleWithConnected, _handleAll }
    }, [_handleWithoutConnected, _handleWithConnected, _handleAll])


    return (
        <PoolContext.Provider value={{
            tokenState,
            handlers,
            poolAddress
        }}>
            {children}
        </PoolContext.Provider>
    )
}
export default RootLayout
