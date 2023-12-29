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
  tokenInInfo: TokenInfo;
  tokenOutInfo: TokenInfo;
  load: {
    finishLoadWithoutConnected: boolean;
    finishLoadWithConnected: boolean;
  };
}

export interface SetTokenInfoAction {
  type: "SET_TOKEN_IN_INFO" | "SET_TOKEN_OUT_INFO";
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
  type: "SET_FINISH_LOAD_WITHOUT_CONNECTED" | "SET_FINISH_LOAD_WITH_CONNECTED";
  payload: boolean;
}

export type swapAction =
  | SetTokenInfoAction
  | SetTokenAction
  | SetTokenAction
  | SetBalanceAction
  | SetSymbolAction
  | SetDecimalsAction
  | SetFinishLoadAction
  | SetImageUrlAction;

export const swapState: SwapState = {
    tokenInInfo: {
        address: "",
        decimals: 0,
        symbol: "",
        balance: 0,
        imageUrl: "",
    },
    tokenOutInfo: {
        address: "",
        decimals: 0,
        symbol: "",
        balance: 0,
        imageUrl: "",
    },
    load: {
        finishLoadWithoutConnected: false,
        finishLoadWithConnected: false,
    },
}

export const swapReducer = (state: SwapState, action: swapAction) => {
    switch (action.type) {
    case "SET_TOKEN_IN_INFO":
        return { ...state, tokenInInfo: action.payload }
    case "SET_TOKEN_OUT_INFO":
        return { ...state, tokenOutInfo: action.payload }
    case "SET_TOKEN_IN":
        return {
            ...state,
            tokenInInfo: { ...state.tokenInInfo, address: action.payload },
        }
    case "SET_TOKEN_OUT":
        return {
            ...state,
            tokenOutInfo: { ...state.tokenOutInfo, address: action.payload },
        }
    case "SET_BALANCE_IN":
        return {
            ...state,
            tokenInInfo: { ...state.tokenInInfo, balance: action.payload },
        }
    case "SET_BALANCE_OUT":
        return {
            ...state,
            tokenOutInfo: { ...state.tokenOutInfo, balance: action.payload },
        }
    case "SET_SYMBOL_IN":
        return {
            ...state,
            tokenInInfo: { ...state.tokenInInfo, symbol: action.payload },
        }
    case "SET_SYMBOL_OUT":
        return {
            ...state,
            tokenOutInfo: { ...state.tokenOutInfo, symbol: action.payload },
        }
    case "SET_DECIMALS_IN":
        return {
            ...state,
            tokenInInfo: { ...state.tokenInInfo, decimals: action.payload },
        }
    case "SET_DECIMALS_OUT":
        return {
            ...state,
            tokenOutInfo: { ...state.tokenOutInfo, decimals: action.payload },
        }
    case "SET_IMAGE_URL_IN":
        return {
            ...state,
            tokenInInfo: { ...state.tokenInInfo, imageUrl: action.payload },
        }
    case "SET_IMAGE_URL_OUT":
        return {
            ...state,
            tokenOutInfo: { ...state.tokenOutInfo, imageUrl: action.payload },
        }
    case "SET_FINISH_LOAD_WITHOUT_CONNECTED":
        return {
            ...state,
            load: { ...state.load, finishLoadWithoutConnected: action.payload },
        }
    case "SET_FINISH_LOAD_WITH_CONNECTED":
        return {
            ...state,
            load: { ...state.load, finishLoadWithConnected: action.payload },
        }
    default:
        return state
    }
}

const useSwapReducer = () => {
    return useReducer(swapReducer, swapState)
}

export default useSwapReducer
