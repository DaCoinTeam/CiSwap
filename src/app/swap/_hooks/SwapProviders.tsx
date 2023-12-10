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
import useSwapState, { SwapState } from "./useSwapState.hook"
import { useSelector } from "react-redux"
import { usePathname, useSearchParams } from "next/navigation"
import { chains } from "@config"
import { ERC20Contract } from "@blockchain"
import { calculateRedenomination, fetchAndCreateSvgBlobUrl } from "@utils"
import { getTokenApi } from "@api"
import { useRouter } from "next/navigation"

interface SwapContext {
  swapState: SwapState;
  actions: {
    doReverse: () => Promise<void>;
  };
  handlers: {
    handleWithoutConnected: () => Promise<void>;
    handleWithConnected: () => Promise<void>;
  };
}

export const SwapContext = createContext<SwapContext | null>(null)

const SwapProviders = (props: ContextProps) => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)
    const account = useSelector((state: RootState) => state.blockchain.account)

    const [swapState, swapDispatch] = useSwapState()
    const router = useRouter()
    const path = usePathname()
    const searchParams = useSearchParams()

    const _getTokenPair = () => {
        const tokenInAddress =
      searchParams.get("tokenInAddress") ??
      chains[chainId].stableTokenAddresses[0]

        const tokenOutAddress =
      searchParams.get("tokenOutAddress") ??
      chains[chainId].exchangeTokenAddress
        return {
            tokenInAddress,
            tokenOutAddress,
        }
    }

    const [preventFetch, setPreventFetch] = useState(false)

    const doReverse = async () => {
        const { tokenInAddress, tokenOutAddress } = _getTokenPair()
        const params = new URLSearchParams(searchParams)
        params.set("tokenInAddress", tokenOutAddress)
        params.set("tokenOutAddress", tokenInAddress)
        router.push(`${path}?${params.toString()}`)

        const tokenInSelected = swapState.tokenOutSelected
        const tokenOutSelected = swapState.tokenInSelected

        swapDispatch({
            type: "SET_TOKEN_IN_SELECTED",
            payload: tokenInSelected,
        })

        swapDispatch({
            type: "SET_TOKEN_OUT_SELECTED",
            payload: tokenOutSelected,
        })

        setPreventFetch(true)
    }

    const actions = useMemo(() => {
        return { doReverse }
    }, [doReverse])

    const finishInitializeRef = useRef(false)

    const handleInitialization = () => {
        const tokenInAddress =
      searchParams.get("tokenInAddress") ??
      chains[chainId].stableTokenAddresses[0]

        swapDispatch({
            type: "SET_TOKEN_IN_ADDRESS",
            payload: tokenInAddress,
        })
        const tokenOutAddress =
      searchParams.get("tokenOutAddress") ??
      chains[chainId].exchangeTokenAddress

        swapDispatch({
            type: "SET_TOKEN_OUT_ADDRESS",
            payload: tokenOutAddress,
        })

        finishInitializeRef.current = true
    }

    useEffect(() => {
        handleInitialization()
    }, [])

    const handleWithoutConnected = async () => {
        const handleTokenIn = async () => {
            const tokenInContract = new ERC20Contract(
                chainId,
                swapState.tokenInSelected.address
            )

            const tokenInDecimals = await tokenInContract.decimals()
            if (tokenInDecimals == null) return
            swapDispatch({ type: "SET_TOKEN_IN_DECIMALS", payload: tokenInDecimals })

            const tokenInPromises: Promise<void>[] = []

            const handleTokenInDTO = async () => {
                const tokenInDTO = await getTokenApi(
                    swapState.tokenInSelected.address,
                    chainId
                )
                if (tokenInDTO != null) {
                    const blobUrl = await fetchAndCreateSvgBlobUrl(
                        tokenInDTO.tokenImageUrl
                    )
                    if (blobUrl == null) return
                    swapDispatch({ type: "SET_TOKEN_OUT_IMAGE_URL", payload: blobUrl })
                }
            }
            tokenInPromises.push(handleTokenInDTO())

            const handleTokenInSymbol = async () => {
                const tokenInSymbol = await tokenInContract.symbol()
                if (tokenInSymbol == null) return
                swapDispatch({ type: "SET_TOKEN_IN_SYMBOL", payload: tokenInSymbol })
            }
            tokenInPromises.push(handleTokenInSymbol())

            await Promise.all(tokenInPromises)
        }

        const handleTokenOut = async () => {
            const tokenOutContract = new ERC20Contract(
                chainId,
                swapState.tokenOutSelected.address
            )

            const tokenOutDecimals = await tokenOutContract.decimals()
            if (tokenOutDecimals == null) return
            swapDispatch({
                type: "SET_TOKEN_IN_DECIMALS",
                payload: tokenOutDecimals,
            })

            const tokenOutPromises: Promise<void>[] = []

            const handleTokenOutDTO = async () => {
                const tokenOutDTO = await getTokenApi(
                    swapState.tokenInSelected.address,
                    chainId
                )
                if (tokenOutDTO != null) {
                    const blobUrl = await fetchAndCreateSvgBlobUrl(
                        tokenOutDTO.tokenImageUrl
                    )
                    if (blobUrl == null) return
                    swapDispatch({ type: "SET_TOKEN_OUT_IMAGE_URL", payload: blobUrl })
                }
            }
            tokenOutPromises.push(handleTokenOutDTO())

            const handleTokenOutSymbol = async () => {
                const tokenOutSymbol = await tokenOutContract.symbol()
                if (tokenOutSymbol == null) return
                swapDispatch({ type: "SET_TOKEN_OUT_SYMBOL", payload: tokenOutSymbol })
            }
            tokenOutPromises.push(handleTokenOutSymbol())

            await Promise.all(tokenOutPromises)
        }

        const promises: Promise<void>[] = []
        promises.push(handleTokenIn())
        promises.push(handleTokenOut())
        await Promise.all(promises)

        swapDispatch({
            type: "SET_FINISH_LOAD_WITHOUT_CONNECTED",
            payload: true,
        })
    }

    useEffect(() => {
        if (!finishInitializeRef.current) return
        if (preventFetch) {
            setPreventFetch(false)
            return
        }
        handleWithoutConnected()
    }, [
        finishInitializeRef.current,
        swapState.tokenInSelected.address,
        swapState.tokenOutSelected.address,
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
            swapState.tokenInSelected.address
        )
        const tokenOutContract = new ERC20Contract(
            chainId,
            swapState.tokenOutSelected.address
        )

        const promises: Promise<void>[] = []

        const handleTokenInBalance = async () => {
            const tokenInBalance = await tokenInContract.balanceOf(account)
            if (tokenInBalance == null) return
            swapDispatch({
                type: "SET_TOKEN_IN_BALANCE",
                payload: calculateRedenomination(
                    tokenInBalance,
                    swapState.tokenInSelected.decimals,
                    3
                ),
            })
        }
        promises.push(handleTokenInBalance())

        const handleTokenOutBalance = async () => {
            const tokenOutBalance = await tokenOutContract.balanceOf(account)
            if (tokenOutBalance == null) return
            swapDispatch({
                type: "SET_TOKEN_OUT_BALANCE",
                payload: calculateRedenomination(
                    tokenOutBalance,
                    swapState.tokenOutSelected.decimals,
                    3
                ),
            })
        }
        promises.push(handleTokenOutBalance())
    }

    useEffect(() => {
        handleWithConnected()
    }, [account, swapState.load.finishLoadWithoutConnected])

    const handlers = useMemo(() => {
        return { handleWithoutConnected, handleWithConnected }
    }, [handleWithoutConnected, handleWithConnected])
    return (
        <SwapContext.Provider value={{ swapState, actions, handlers }}>
            {props.children}
        </SwapContext.Provider>
    )
}
export default SwapProviders
