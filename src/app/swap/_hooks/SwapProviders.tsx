"use client"
import { ContextProps } from "@app/_shared"
import { RootState } from "@redux"
import React, {
    createContext,
    useEffect,
    useMemo,
    useRef
} from "react"
import useSwapState, { SwapState } from "./useSwapState.hook"
import { useSelector } from "react-redux"
import { useSearchParams } from "next/navigation"
import { chainInfos } from "@config"
import { ERC20Contract } from "@blockchain"
import { calculateRedenomination, fetchAndCreateSvgBlobUrl } from "@utils"
import { getTokenApi } from "@api"

interface SwapContext {
  swapState: SwapState;
  handlers: {
    _handleWithoutConnected: () => Promise<void>;
    _handleWithConnected: () => Promise<void>;
    _handleAll: () => Promise<void>;
  };
}

export const SwapContext = createContext<SwapContext | null>(null)

const SwapProviders = (props: ContextProps) => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)
    const account = useSelector((state: RootState) => state.blockchain.account)

    const [swapState, swapDispatch] = useSwapState()
    const searchParams = useSearchParams()

    const finishInitializeRef = useRef(false)

    useEffect(() => {
        const tokenInAddress =
      searchParams.get("tokenInAddress") ??
      chainInfos[chainId].stableTokenAddresses[0]

        swapDispatch({
            type: "SET_TOKEN_IN_ADDRESS",
            payload: tokenInAddress,
        })
        const tokenOutAddress =
      searchParams.get("tokenOutAddress") ??
      chainInfos[chainId].exchangeTokenAddress

        swapDispatch({
            type: "SET_TOKEN_OUT_ADDRESS",
            payload: tokenOutAddress,
        })

        finishInitializeRef.current = true
    }, [])

    const _handleWithoutConnected = async () => {
        const _handleTokenIn = async () => {
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

        const _handleTokenOut = async () => {
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
        promises.push(_handleTokenIn())
        promises.push(_handleTokenOut())
        await Promise.all(promises)

        swapDispatch({
            type: "SET_FINISH_LOAD_WITHOUT_CONNECTED",
            payload: true,
        })
    }

    useEffect(() => {
        if (!finishInitializeRef.current) return
        _handleWithoutConnected()
    }, [finishInitializeRef.current])

    const _handleWithConnected = async () => {
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
        _handleWithConnected()
    }, [account, swapState.load.finishLoadWithoutConnected])

    const _handleAll = async () => {
        await _handleWithoutConnected()
        await _handleWithConnected()
    }

    const handlers = useMemo(() => {
        return { _handleWithoutConnected, _handleWithConnected, _handleAll }
    }, [_handleWithoutConnected, _handleWithConnected, _handleAll])
    return (
        <SwapContext.Provider value={{ swapState, handlers }}>
            {props.children}
        </SwapContext.Provider>
    )
}
export default SwapProviders
