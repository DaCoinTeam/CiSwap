"use client"
import { IdentifierParams, ProvidersProps } from "@app/_shared"
import { RootState } from "@redux"
import React, {
    createContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { useSelector } from "react-redux"
import {
    usePathname,
    useSearchParams,
    useRouter,
    useParams,
} from "next/navigation"
import { chainInfos } from "@config"
import { ERC20Contract, PoolContract } from "@blockchain"
import { getTokenApi } from "@services"
import usePoolReducer, { PoolAction, PoolState } from "./usePoolReducer.hook"

interface PoolContext {
  poolState: PoolState;
  poolDispatch: React.Dispatch<PoolAction>;
  actions: {
    doSomething: () => void;
  };
  updaters: {
    initialize: () => void;
    loadBeforeConnectWallet: () => Promise<void>;
    loadAfterConnectWallet: () => Promise<void>;
  };
}

export const PoolContext = createContext<PoolContext | null>(null)

const PoolProviders = (props: ProvidersProps) => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)
    const account = useSelector((state: RootState) => state.blockchain.account)

    const [poolState, poolDispatch] = usePoolReducer()
    const { id } = useParams<IdentifierParams>()
    console.log(poolState)
    const doSomething = () => {
        console.log("X")
    }

    const actions = useMemo(() => ({ doSomething }), [])

    const initialize = () => {
        poolDispatch({
            type: "SET_ADDRESS",
            payload: id,
        })
        poolDispatch({
            type: "SET_FINISH_INITIALIZE",
            payload: true,
        })
    }

    useEffect(() => {
        initialize()
    }, [])

    const loadBeforeConnectWallet = async () => {
        const poolContract = new PoolContract(chainId, poolState.address)
        const updateInfo0 = async () => {
            const token0 = await poolContract.token0()
            if (token0 === null) return
            poolDispatch({ type: "SET_TOKEN_0", payload: token0 })

            const token0Contract = new ERC20Contract(chainId, token0)

            const decimals0 = await token0Contract.decimals()
            if (decimals0 === null) return
            poolDispatch({ type: "SET_DECIMALS_0", payload: decimals0 })

            const promises: Promise<void>[] = []

            const additional0Promise = async () => {
                const additional0 = await getTokenApi(poolState.info0.address, chainId)
                if (additional0 === null) return
            }
            promises.push(additional0Promise())

            const symbol0Promise = async () => {
                const symbol0 = await token0Contract.symbol()
                if (!symbol0) return
                poolDispatch({ type: "SET_SYMBOL_0", payload: symbol0 })
            }
            promises.push(symbol0Promise())

            await Promise.all(promises)
        }

        const updateInfo1 = async () => {
            const token1 = await poolContract.token1()
            if (token1 === null) return
            poolDispatch({ type: "SET_TOKEN_1", payload: token1 })

            const token1Contract = new ERC20Contract(chainId, token1)

            const decimals1 = await token1Contract.decimals()
            if (decimals1 === null) return
            poolDispatch({
                type: "SET_DECIMALS_1",
                payload: decimals1,
            })

            const promises: Promise<void>[] = []

            const additional1Promise = async () => {
                const additional1 = await getTokenApi(poolState.info0.address, chainId)
                if (additional1 === null) return
            }
            promises.push(additional1Promise())

            const symbol1Promise = async () => {
                const symbol1 = await token1Contract.symbol()
                if (symbol1 === null) return
                poolDispatch({ type: "SET_SYMBOL_1", payload: symbol1 })
            }
            promises.push(symbol1Promise())

            await Promise.all(promises)
        }

        const promises: Promise<void>[] = []
        promises.push(updateInfo0())
        promises.push(updateInfo1())
        await Promise.all(promises)

        poolDispatch({
            type: "SET_FINISH_LOAD_BEFORE_CONNECT_WALLET",
            payload: true,
        })
    }

    const beforeHasMountedRef = useRef(true)
    useEffect(() => {
        if (beforeHasMountedRef.current) {
            beforeHasMountedRef.current = false
            return
        }
        if (!poolState.status.finishInitialize) return

        loadBeforeConnectWallet()
    }, [poolState.status.finishInitialize])

    const loadAfterConnectWallet = async () => {
        if (!account) {
            poolDispatch({
                type: "SET_FINISH_LOAD_AFTER_CONNECT_WALLET",
                payload: false,
            })
            return
        }

        poolDispatch({
            type: "SET_FINISH_LOAD_AFTER_CONNECT_WALLET",
            payload: true,
        })
    }

    const afterHasMountedRef = useRef(true)
    useEffect(() => {
        if (!afterHasMountedRef.current) {
            afterHasMountedRef.current = false
            return
        }
        loadAfterConnectWallet()
    }, [account, poolState.status.finishLoadAfterConnectWallet])

    const updaters = useMemo(() => {
        return {
            initialize,
            loadBeforeConnectWallet,
            loadAfterConnectWallet,
        }
    }, [initialize, loadBeforeConnectWallet, loadAfterConnectWallet])

    const poolContext = useMemo(() => {
        return {
            poolState,
            poolDispatch,
            actions,
            updaters,
        }
    }, [poolState, poolDispatch, actions, updaters])
    return (
        <PoolContext.Provider value={poolContext}>
            {props.children}
        </PoolContext.Provider>
    )
}
export default PoolProviders
