"use client"
import { ContextProps } from "@app/_shared"
import { RootState } from "@redux"
import React, {
    createContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import useSwapReducer, { SwapState } from "./useSwapReducer.hook"
import { useSelector } from "react-redux"
import { usePathname, useSearchParams } from "next/navigation"
import { chainInfos } from "@config"
import { ERC20Contract } from "@blockchain"
import { computeRedenomination, fetchAndCreateSvgBlobUrl } from "@utils"
import { getTokenApi } from "@services"
import { useRouter } from "next/navigation"

interface SwapContext {
  swapState: SwapState;
  actions: {
    doReverse: () => Promise<void>;
  };
  handlers: {
    handleInitialization: () => void;
    handleWithoutConnected: () => Promise<void>;
    handleWithConnected: () => Promise<void>;
  };
}

export const SwapContext = createContext<SwapContext | null>(null)

const SwapProviders = (props: ContextProps) => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)
    const account = useSelector((state: RootState) => state.blockchain.account)

    const [swapState, swapDispatch] = useSwapReducer()
    const router = useRouter()
    const path = usePathname()
    const searchParams = useSearchParams()

    const _getTokenPair = () => {
        const tokenIn =
      searchParams.get("tokenIn") ?? chainInfos[chainId].stableTokens[0]

        const tokenOut =
      searchParams.get("tokenOut") ?? chainInfos[chainId].exchangeToken
        return {
            tokenIn,
            tokenOut,
        }
    }

    const [preventExecution, setPreventExecution] = useState(false)

    const doReverse = async () => {
        const { tokenIn, tokenOut } = _getTokenPair()
        const params = new URLSearchParams(searchParams)
        params.set("tokenIn", tokenOut)
        params.set("tokenOut", tokenIn)
        router.push(`${path}?${params.toString()}`)

        const { tokenInInfo, tokenOutInfo } = swapState

        swapDispatch({
            type: "SET_TOKEN_IN_INFO",
            payload: tokenOutInfo
        })

        swapDispatch({
            type: "SET_TOKEN_OUT_INFO",
            payload: tokenInInfo
        })

        setPreventExecution(true)
    }

    const actions = useMemo(() => {
        return { doReverse }
    }, [doReverse])

    const finishInitializeRef = useRef(false)

    const handleInitialization = () => {
        const tokenIn =
      searchParams.get("tokenIn") ?? chainInfos[chainId].stableTokens[0]

        swapDispatch({
            type: "SET_TOKEN_IN",
            payload: tokenIn,
        })
        const tokenOut =
      searchParams.get("tokenOut") ?? chainInfos[chainId].exchangeToken

        swapDispatch({
            type: "SET_TOKEN_OUT",
            payload: tokenOut,
        })

        finishInitializeRef.current = true
    }

    useEffect(() => {
        handleInitialization()
    }, [])

    const handleWithoutConnected = async () => {
        const handleTokenInInfo = async () => {
            const tokenInContract = new ERC20Contract(
                chainId,
                swapState.tokenInInfo.address
            )

            const decimalsIn = await tokenInContract.decimals()
            if (decimalsIn == null) return
            swapDispatch({ type: "SET_DECIMALS_IN", payload: decimalsIn })

            const promises: Promise<void>[] = []

            const handleAdditionalIn = async () => {
                const additionalIn = await getTokenApi(swapState.tokenInInfo.address, chainId)
                if (additionalIn != null) {
                    const blobUrl = await fetchAndCreateSvgBlobUrl(additionalIn.imageUrlUrl)
                    if (blobUrl == null) return
                    swapDispatch({ type: "SET_IMAGE_URL_IN", payload: blobUrl })
                }
            }
            promises.push(handleAdditionalIn())

            const handleSymbolIn = async () => {
                const symbolIn = await tokenInContract.symbol()
                if (symbolIn == null) return
                swapDispatch({ type: "SET_SYMBOL_IN", payload: symbolIn })
            }
            promises.push(handleSymbolIn())

            await Promise.all(promises)
        }

        const handleTokenOutInfo = async () => {
            const tokenOutContract = new ERC20Contract(
                chainId,
                swapState.tokenOutInfo.address
            )

            const decimalsOut = await tokenOutContract.decimals()
            if (decimalsOut == null) return
            swapDispatch({
                type: "SET_DECIMALS_OUT",
                payload: decimalsOut,
            })

            const promises: Promise<void>[] = []

            const handleAdditionalOut = async () => {
                const additionalOut = await getTokenApi(
                    swapState.tokenInInfo.address,
                    chainId
                )
                if (additionalOut != null) {
                    const blobUrl = await fetchAndCreateSvgBlobUrl(additionalOut.imageUrlUrl)
                    if (blobUrl == null) return
                    swapDispatch({ type: "SET_IMAGE_URL_OUT", payload: blobUrl })
                }
            }
            promises.push(handleAdditionalOut())

            const handleSymbolOut = async () => {
                const symbolOut = await tokenOutContract.symbol()
                if (symbolOut == null) return
                swapDispatch({ type: "SET_SYMBOL_OUT", payload: symbolOut })
            }
            promises.push(handleSymbolOut())

            await Promise.all(promises)
        }

        const promises: Promise<void>[] = []
        promises.push(handleTokenInInfo())
        promises.push(handleTokenOutInfo())
        await Promise.all(promises)

        swapDispatch({
            type: "SET_FINISH_LOAD_WITHOUT_CONNECTED",
            payload: true,
        })
    }

    useEffect(() => {
        if (!finishInitializeRef.current) return
        if (preventExecution) {
            setPreventExecution(false)
            return
        }
        handleWithoutConnected()
    }, [
        finishInitializeRef.current,
        swapState.tokenInInfo.address,
        swapState.tokenOutInfo.address,
    ])

    const handleWithConnected = async () => {
        if (!account || !swapState.load.finishLoadWithoutConnected) {
            swapDispatch({
                type: "SET_FINISH_LOAD_WITH_CONNECTED",
                payload: false,
            })
            return
        }

        const tokenInContract = new ERC20Contract(
            chainId,
            swapState.tokenInInfo.address
        )
        const tokenOutContract = new ERC20Contract(
            chainId,
            swapState.tokenOutInfo.address
        )

        const promises: Promise<void>[] = []

        const handleBalanceIn = async () => {
            const tokenInBalance = await tokenInContract.balanceOf(account)
            if (tokenInBalance == null) return
            swapDispatch({
                type: "SET_BALANCE_IN",
                payload: computeRedenomination(
                    tokenInBalance,
                    swapState.tokenInInfo.decimals,
                    3
                ),
            })
        }
        promises.push(handleBalanceIn())

        const handleBalanceOut = async () => {
            const tokenOutBalance = await tokenOutContract.balanceOf(account)
            if (tokenOutBalance == null) return
            swapDispatch({
                type: "SET_BALANCE_OUT",
                payload: computeRedenomination(
                    tokenOutBalance,
                    swapState.tokenOutInfo.decimals,
                    3
                ),
            })
        }
        promises.push(handleBalanceOut())
    }

    useEffect(() => {
        handleWithConnected()
    }, [account, swapState.load.finishLoadWithoutConnected])

    const handlers = useMemo(() => {
        return {
            handleInitialization,
            handleWithoutConnected,
            handleWithConnected,
        }
    }, [handleInitialization, handleWithoutConnected, handleWithConnected])
    return (
        <SwapContext.Provider value={{ swapState, actions, handlers }}>
            {props.children}
        </SwapContext.Provider>
    )
}
export default SwapProviders
