"use client"
import { RootState } from "@redux"
import React, { ReactNode, createContext, useEffect, useReducer } from "react"
import { useSelector } from "react-redux"
import { TokenState, initialTokenState, tokenReducer } from "./_definitions"
import { useParams } from "next/navigation"
import { calculateExponent, calculateRedenomination } from "@utils"
import { ERC20Contract, LiquidityPoolContract } from "@blockchain"

export const TokenStateContext = createContext<TokenState | null>(null)

interface UpdateTokenStateContext {
  _handleWithoutConnected: () => Promise<void>;
  _handleWithConnected: () => Promise<void>;
  _handleAll: () => Promise<void>;
}
export const UpdateTokenStateContext =
  createContext<UpdateTokenStateContext | null>(null)

export const PoolAddressContext = createContext("")

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

        const token0Address = await poolContract.token0()
        if (token0Address == null) return
        tokenDispatch({ type: "SET_TOKEN0_ADDRESS", payload: token0Address })
        const token0Contract = new ERC20Contract(chainName, token0Address)

        const token1Address = await poolContract.token1()
        if (token1Address == null) return
        tokenDispatch({ type: "SET_TOKEN1_ADDRESS", payload: token1Address })
        const token1Contract = new ERC20Contract(chainName, token1Address)

        const token0Symbol = await token0Contract.symbol()
        if (token0Symbol == null) return
        tokenDispatch({ type: "SET_TOKEN0_SYMBOL", payload: token0Symbol })

        const token1Symbol = await token1Contract.symbol()
        if (token1Symbol == null) return
        tokenDispatch({ type: "SET_TOKEN1_SYMBOL", payload: token1Symbol })

        const LPTokenSymbol = await poolContract.symbol()
        if (LPTokenSymbol == null) return
        tokenDispatch({
            type: "SET_LP_TOKEN_SYMBOL",
            payload: LPTokenSymbol,
        })

        const token0Decimals = await token0Contract.decimals()
        if (token0Decimals == null) return
        tokenDispatch({ type: "SET_TOKEN0_DECIMALS", payload: token0Decimals })

        const token1Decimals = await token1Contract.decimals()
        if (token1Decimals == null) return
        tokenDispatch({ type: "SET_TOKEN1_DECIMALS", payload: token1Decimals })

        const LPTokenDecimals = await poolContract.decimals()
        if (LPTokenDecimals == null) return
        tokenDispatch({
            type: "SET_LP_TOKEN_DECIMALS",
            payload: LPTokenDecimals,
        })

        const token0Price = await poolContract.token1AmountOut(
            BigInt(calculateExponent(token0Decimals))
        )
        if (token0Price == null) return
        tokenDispatch({
            type: "SET_TOKEN0_PRICE",
            payload: calculateRedenomination(token0Price, token1Decimals, 3),
        })

        const token0BasePrice = await poolContract.token0BasePrice()
        if (token0BasePrice == null) return
        tokenDispatch({
            type: "SET_TOKEN0_BASE_PRICE",
            payload: calculateRedenomination(token0BasePrice, token1Decimals, 3),
        })

        const token0MaxPrice = await poolContract.token0MaxPrice()
        if (token0MaxPrice == null) return
        tokenDispatch({
            type: "SET_TOKEN0_MAX_PRICE",
            payload: calculateRedenomination(token0MaxPrice, token1Decimals, 3),
        })

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

        const token0Balance = await token0Contract.balanceOf(account)
        console.log(token0Balance)
        if (token0Balance == null) return
        tokenDispatch({
            type: "SET_TOKEN0_BALANCE",
            payload: calculateRedenomination(
                token0Balance,
                tokenState.token0Decimals,
                3
            ),
        })

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

    useEffect(() => {
        _handleWithConnected()
    }, [account, tokenState.finishLoadWithoutConnected])

    const _handleAll = async () => {
        await _handleWithoutConnected()
        await _handleWithConnected
    }

    return (
        <TokenStateContext.Provider value={tokenState}>
            <PoolAddressContext.Provider value={poolAddress}>
                <UpdateTokenStateContext.Provider
                    value={{ _handleWithoutConnected, _handleWithConnected, _handleAll }}
                >
                    {children}
                </UpdateTokenStateContext.Provider>
            </PoolAddressContext.Provider>
        </TokenStateContext.Provider>
    )
}
export default RootLayout
