import { useReducer } from "react"
import { Address } from "web3"

export interface TokenInfo {
  address: Address;
  symbol: string;
  decimals: number;
  imageUrl: string;
  balance: number;
}

export interface PoolState {
  address: Address;
  info0: TokenInfo;
  info1: TokenInfo;
  status: {
    finishInitialize: boolean;
    finishLoadBeforeConnectWallet: boolean;
    finishLoadAfterConnectWallet: boolean;
  };
}

export interface SetAddress {
  type: "SET_ADDRESS";
  payload: Address;
}

export interface SetTokenInfoAction {
  type: "SET_INFO_0" | "SET_INFO_1";
  payload: TokenInfo;
}

export interface SetTokenAction {
  type: "SET_TOKEN_0" | "SET_TOKEN_1";
  payload: Address;
}

export interface SetBalanceAction {
  type: "SET_BALANCE_0" | "SET_BALANCE_1";
  payload: number;
}

export interface SetSymbolAction {
  type: "SET_SYMBOL_0" | "SET_SYMBOL_1";
  payload: string;
}

export interface SetImageUrlAction {
  type: "SET_IMAGE_URL_0" | "SET_IMAGE_URL_1";
  payload: string;
}

export interface SetDecimalsAction {
  type: "SET_DECIMALS_0" | "SET_DECIMALS_1";
  payload: number;
}

export interface SetFinishLoadAction {
  type:
    | "SET_FINISH_INITIALIZE"
    | "SET_FINISH_LOAD_BEFORE_CONNECT_WALLET"
    | "SET_FINISH_LOAD_AFTER_CONNECT_WALLET";
  payload: boolean;
}

export type PoolAction =
  | SetAddress
  | SetTokenInfoAction
  | SetTokenAction
  | SetBalanceAction
  | SetSymbolAction
  | SetDecimalsAction
  | SetFinishLoadAction
  | SetImageUrlAction;

export const poolState: PoolState = {
    address: "",
    info0: {
        address: "",
        decimals: 0,
        symbol: "",
        balance: 0,
        imageUrl: "",
    },
    info1: {
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

export const poolReducer = (state: PoolState, action: PoolAction) => {
    switch (action.type) {
    case "SET_ADDRESS":
        return { ...state, address: action.payload }
    case "SET_INFO_0":
        return { ...state, info0: action.payload }
    case "SET_INFO_1":
        return { ...state, info1: action.payload }
    case "SET_TOKEN_0":
        return {
            ...state,
            info0: { ...state.info0, address: action.payload },
        }
    case "SET_TOKEN_1":
        return {
            ...state,
            info1: { ...state.info1, address: action.payload },
        }
    case "SET_BALANCE_0":
        return {
            ...state,
            info0: { ...state.info0, balance: action.payload },
        }
    case "SET_BALANCE_1":
        return {
            ...state,
            info1: { ...state.info1, balance: action.payload },
        }
    case "SET_SYMBOL_0":
        return {
            ...state,
            info0: { ...state.info0, symbol: action.payload },
        }
    case "SET_SYMBOL_1":
        return {
            ...state,
            info1: { ...state.info1, symbol: action.payload },
        }
    case "SET_DECIMALS_0":
        return {
            ...state,
            info0: { ...state.info0, decimals: action.payload },
        }
    case "SET_DECIMALS_1":
        return {
            ...state,
            info1: { ...state.info1, decimals: action.payload },
        }
    case "SET_IMAGE_URL_0":
        return {
            ...state,
            info0: { ...state.info0, imageUrl: action.payload },
        }
    case "SET_IMAGE_URL_1":
        return {
            ...state,
            info1: { ...state.info1, imageUrl: action.payload },
        }
    case "SET_FINISH_INITIALIZE":
        return {
            ...state,
            status: { ...state.status, finishInitialize: action.payload },
        }
    case "SET_FINISH_LOAD_BEFORE_CONNECT_WALLET":
        return {
            ...state,
            status: {
                ...state.status,
                finishLoadBeforeConnectWallet: action.payload,
            },
        }
    case "SET_FINISH_LOAD_AFTER_CONNECT_WALLET":
        return {
            ...state,
            status: {
                ...state.status,
                finishLoadAfterConnectWallet: action.payload,
            },
        }
    default:
        return state
    }
}

const usePoolReducer = () => {
    return useReducer(poolReducer, poolState)
}

export default usePoolReducer
