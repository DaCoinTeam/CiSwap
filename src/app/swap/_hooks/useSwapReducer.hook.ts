import { useReducer } from "react"
import { Address } from "web3"

export interface TokenInfo {
  address: Address;
  symbol: string;
  decimals: number;
  imageUrl: string;
  balance: number;
}

export interface SwapState {
  infoIn: TokenInfo;
  infoOut: TokenInfo;
  status: {
    finishInitialize: boolean;
    finishLoadBeforeConnectWallet: boolean;
    finishLoadAfterConnectWallet: boolean;
  };
}

export interface SetTokenInfoAction {
  type: "SET_INFO_IN" | "SET_INFO_OUT";
  payload: TokenInfo;
}

export interface SetTokenAction {
  type: "SET_TOKEN_IN" | "SET_TOKEN_OUT";
  payload: Address;
}

export interface SetBalanceAction {
  type: "SET_BALANCE_IN" | "SET_BALANCE_OUT";
  payload: number;
}

export interface SetSymbolAction {
  type: "SET_SYMBOL_IN" | "SET_SYMBOL_OUT";
  payload: string;
}

export interface SetImageUrlAction {
  type: "SET_IMAGE_URL_IN" | "SET_IMAGE_URL_OUT";
  payload: string;
}

export interface SetDecimalsAction {
  type: "SET_DECIMALS_IN" | "SET_DECIMALS_OUT";
  payload: number;
}

export interface SetFinishLoadAction {
  type: "SET_FINISH_INITIALIZE" | "SET_FINISH_LOAD_BEFORE_CONNECT_WALLET" | "SET_FINISH_LOAD_AFTER_CONNECT_WALLET";
  payload: boolean;
}

export type SwapAction =
  | SetTokenInfoAction
  | SetTokenAction
  | SetTokenAction
  | SetBalanceAction
  | SetSymbolAction
  | SetDecimalsAction
  | SetFinishLoadAction
  | SetImageUrlAction;

export const swapState: SwapState = {
    infoIn: {
        address: "",
        decimals: 0,
        symbol: "",
        balance: 0,
        imageUrl: "",
    },
    infoOut: {
        address: "",
        decimals: 0,
        symbol: "",
        balance: 0,
        imageUrl: "",
    },
    status: {
        finishInitialize: false,
        finishLoadBeforeConnectWallet: false,
        finishLoadAfterConnectWallet: false,
    },
}

export const swapReducer = (state: SwapState, action: SwapAction) => {
    switch (action.type) {
    case "SET_INFO_IN":
        return { ...state, infoIn: action.payload }
    case "SET_INFO_OUT":
        return { ...state, infoOut: action.payload }
    case "SET_TOKEN_IN":
        return {
            ...state,
            infoIn: { ...state.infoIn, address: action.payload },
        }
    case "SET_TOKEN_OUT":
        return {
            ...state,
            infoOut: { ...state.infoOut, address: action.payload },
        }
    case "SET_BALANCE_IN":
        return {
            ...state,
            infoIn: { ...state.infoIn, balance: action.payload },
        }
    case "SET_BALANCE_OUT":
        return {
            ...state,
            infoOut: { ...state.infoOut, balance: action.payload },
        }
    case "SET_SYMBOL_IN":
        return {
            ...state,
            infoIn: { ...state.infoIn, symbol: action.payload },
        }
    case "SET_SYMBOL_OUT":
        return {
            ...state,
            infoOut: { ...state.infoOut, symbol: action.payload },
        }
    case "SET_DECIMALS_IN":
        return {
            ...state,
            infoIn: { ...state.infoIn, decimals: action.payload },
        }
    case "SET_DECIMALS_OUT":
        return {
            ...state,
            infoOut: { ...state.infoOut, decimals: action.payload },
        }
    case "SET_IMAGE_URL_IN":
        return {
            ...state,
            infoIn: { ...state.infoIn, imageUrl: action.payload },
        }
    case "SET_IMAGE_URL_OUT":
        return {
            ...state,
            infoOut: { ...state.infoOut, imageUrl: action.payload },
        }
    case "SET_FINISH_INITIALIZE":
        return {
            ...state,
            status: { ...state.status, finishInitialize: action.payload },
        }
    case "SET_FINISH_LOAD_BEFORE_CONNECT_WALLET":
        return {
            ...state,
            status: { ...state.status, finishLoadBeforeConnectWallet: action.payload },
        }
    case "SET_FINISH_LOAD_AFTER_CONNECT_WALLET":
        return {
            ...state,
            status: { ...state.status, finishLoadAfterConnectWallet: action.payload },
        }
    default:
        return state
    }
}

const useSwapReducer = () => {
    return useReducer(swapReducer, swapState)
}

export default useSwapReducer
