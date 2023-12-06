import { useReducer } from "react"
import { Address } from "web3"

export interface SelectedToken {
  address: Address;
  symbol: string;
  decimals: number;
  imageUrl: string;
  balance: number;
}
export interface SwapState {
  tokenInSelected: SelectedToken;
  tokenOutSelected: SelectedToken;
  load: {
    finishLoadWithoutConnected: boolean;
    finishLoadWithConnected: boolean;
  };
}

export interface SetTokenAction {
  type: "SET_TOKEN_IN_ADDRESS" | "SET_TOKEN_OUT_ADDRESS";
  payload: string;
}

export interface SetTokenBalanceAction {
  type: "SET_TOKEN_IN_BALANCE" | "SET_TOKEN_OUT_BALANCE";
  payload: number;
}

export interface SetTokenSymbolAction {
  type: "SET_TOKEN_IN_SYMBOL" | "SET_TOKEN_OUT_SYMBOL";
  payload: string;
}

export interface SetTokenImageUrlAction {
  type: "SET_TOKEN_IN_IMAGE_URL" | "SET_TOKEN_OUT_IMAGE_URL";
  payload: string;
}

export interface SetTokenDecimalsAction {
  type: "SET_TOKEN_IN_DECIMALS" | "SET_TOKEN_OUT_DECIMALS";
  payload: number;
}

export interface SetFinishLoadAction {
  type: "SET_FINISH_LOAD_WITHOUT_CONNECTED" | "SET_FINISH_LOAD_WITH_CONNECTED";
  payload: boolean;
}

export type SwapAction =
  | SetTokenAction
  | SetTokenBalanceAction
  | SetTokenSymbolAction
  | SetTokenDecimalsAction
  | SetFinishLoadAction
  | SetTokenImageUrlAction

export const initialSwapState: SwapState = {
    tokenInSelected: {
        address: "",
        decimals: 0,
        symbol: "",
        balance: 0,
        imageUrl: "",
    },
    tokenOutSelected: {
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

export const swapReducer = (state: SwapState, action: SwapAction) => {
    switch (action.type) {
    case "SET_TOKEN_IN_ADDRESS":
        return {
            ...state,
            tokenInSelected: { ...state.tokenInSelected, address: action.payload },
        }
    case "SET_TOKEN_OUT_ADDRESS":
        return {
            ...state,
            tokenOutSelected: { ...state.tokenOutSelected, address: action.payload },
        }
    case "SET_TOKEN_IN_BALANCE":
        return {
            ...state,
            tokenInSelected: { ...state.tokenInSelected, balance: action.payload },
        }
    case "SET_TOKEN_OUT_BALANCE":
        return {
            ...state,
            tokenOutSelected: { ...state.tokenOutSelected, balance: action.payload },
        }
    case "SET_TOKEN_IN_SYMBOL":
        return {
            ...state,
            tokenInSelected: { ...state.tokenInSelected, symbol: action.payload },
        }
    case "SET_TOKEN_OUT_SYMBOL":
        return {
            ...state,
            tokenOutSelected: { ...state.tokenOutSelected, symbol: action.payload },
        }
    case "SET_TOKEN_IN_DECIMALS":
        return {
            ...state,
            tokenInSelected: { ...state.tokenInSelected, decimals: action.payload },
        }
    case "SET_TOKEN_OUT_DECIMALS":
        return {
            ...state,
            tokenOutSelected: { ...state.tokenOutSelected, decimals: action.payload },
        }
    case "SET_TOKEN_IN_IMAGE_URL":
        return {
            ...state,
            tokenInSelected: { ...state.tokenInSelected, imageUrl: action.payload },
        }
    case "SET_TOKEN_OUT_IMAGE_URL":
        return {
            ...state,
            tokenOutSelected: { ...state.tokenOutSelected, imageUrl: action.payload },
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

const useSwapState = () => {
    return useReducer(swapReducer, initialSwapState)
}

export default useSwapState
