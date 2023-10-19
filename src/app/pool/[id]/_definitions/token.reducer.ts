export type TokenState = {
    token0Address: string
    token1Address: string
    token0Balance: number
    token1Balance: number
    token0Locked: number
    token1Locked: number
    token0Price: number
    token0BasePrice: number
    token0MaxPrice: number
    token0Symbol: string
    token1Symbol: string
    token0Decimals: number
    token1Decimals: number
    token0Constant: bigint
    token1Constant: bigint

    LPTokenBalance: number
    LPTokenSymbol: string
    LPTokenDecimals: number
    LPTokenTotalSupply: number
    LPTokenAmountLocked: number

    finishLoadWithoutConnected: boolean
    finishLoadWithConnected: boolean
}

export interface SetTokenAction {
    type: "SET_TOKEN0_ADDRESS" | "SET_TOKEN1_ADDRESS"
    payload: string
}

export interface SetTokenBalanceAction {
    type: "SET_TOKEN0_BALANCE" | "SET_TOKEN1_BALANCE" | "SET_TOKEN0_PRICE" | "SET_TOKEN0_BASE_PRICE" |  "SET_TOKEN0_MAX_PRICE" |  "SET_LP_TOKEN_BALANCE" | "SET_TOKEN0_LOCKED" | "SET_TOKEN1_LOCKED" 
    payload: number
}

export interface SetTokenSymbolAction {
    type: "SET_TOKEN0_SYMBOL" | "SET_TOKEN1_SYMBOL" | "SET_LP_TOKEN_SYMBOL"
    payload: string
}

export interface SetLPTokenTotalSupplyAction {
    type: "SET_LP_TOKEN_TOTAL_SUPPLY" | "SET_LP_TOKEN_AMOUNT_LOCKED"
    payload: number
}

export interface SetTokenDecimalsAction {
    type: "SET_TOKEN0_DECIMALS" | "SET_TOKEN1_DECIMALS" | "SET_LP_TOKEN_DECIMALS"
    payload: number
}

export interface SetTokenConstantAction {
    type: "SET_TOKEN0_CONSTANT" | "SET_TOKEN1_CONSTANT"
    payload: bigint
}

export interface SetFinishLoad {
    type: "SET_FINISH_LOAD_WITHOUT_CONNECTED" | "SET_FINISH_LOAD_WITH_CONNECTED"
    payload: boolean
}


export type TokenAction = SetTokenAction | SetTokenBalanceAction | SetTokenSymbolAction | SetTokenDecimalsAction | SetTokenConstantAction | SetFinishLoad | SetLPTokenTotalSupplyAction

export const initialTokenState: TokenState = {
    token0Address: "",
    token1Address: "",
    token0Balance: 0,
    token1Balance: 0,
    token0Locked: 0,
    token1Locked: 0,
    token0BasePrice: 0,
    token0Price: 0,
    token0MaxPrice: 0,
    token0Symbol: "",
    token1Symbol: "",
    token0Decimals: 0,
    token1Decimals: 0,
    token0Constant: BigInt(0),
    token1Constant: BigInt(0),


    LPTokenBalance: 0,
    LPTokenDecimals: 0,
    LPTokenSymbol: "",
    LPTokenTotalSupply: 0,
    LPTokenAmountLocked: 0,

    finishLoadWithoutConnected: false,
    finishLoadWithConnected: false
}

export const tokenReducer = (
    state: TokenState,
    action: TokenAction
) => {
    switch (action.type) {
    case "SET_TOKEN0_ADDRESS":
        return {
            ...state,
            token0Address: action.payload
        }
    case "SET_TOKEN1_ADDRESS":
        return {
            ...state,
            token1Address: action.payload
        }
    case "SET_TOKEN0_BALANCE":
        return {
            ...state,
            token0Balance: action.payload
        }
    case "SET_TOKEN1_BALANCE":
        return {
            ...state,
            token1Balance: action.payload
        }
    case "SET_TOKEN0_LOCKED":
        return {
            ...state,
            token0Locked: action.payload
        }
    case "SET_TOKEN1_LOCKED":
        return {
            ...state,
            token1Locked: action.payload
        }
    case "SET_TOKEN0_PRICE":
        return {
            ...state,
            token0Price: action.payload
        }
    case "SET_TOKEN0_BASE_PRICE":
        return {
            ...state,
            token0BasePrice: action.payload
        }
    case "SET_TOKEN0_MAX_PRICE":
        return {
            ...state,
            token0MaxPrice: action.payload
        }
    case "SET_TOKEN0_SYMBOL":
        return {
            ...state,
            token0Symbol: action.payload
        }
    case "SET_TOKEN1_SYMBOL":
        return {
            ...state,
            token1Symbol: action.payload
        }
    case "SET_TOKEN0_DECIMALS":
        return {
            ...state,
            token0Decimals: action.payload
        }
    case "SET_TOKEN1_DECIMALS":
        return {
            ...state,
            token1Decimals: action.payload
        }
    case "SET_TOKEN0_CONSTANT":
        return {
            ...state,
            token0Constant: action.payload
        }
    case "SET_TOKEN1_CONSTANT":
        return {
            ...state,
            token1Constant: action.payload
        }
    case "SET_LP_TOKEN_SYMBOL":
        return {
            ...state,
            LPTokenSymbol: action.payload
        }
    case "SET_LP_TOKEN_BALANCE":
        return {
            ...state,
            LPTokenBalance: action.payload
        }
    case "SET_LP_TOKEN_DECIMALS":
        return {
            ...state,
            LPTokenDecimals: action.payload
        }
    case "SET_LP_TOKEN_TOTAL_SUPPLY":
        return {
            ...state,
            LPTokenTotalSupply: action.payload
        }
    case "SET_LP_TOKEN_AMOUNT_LOCKED":
        return {
            ...state,
            LPTokenAmountLocked: action.payload
        }
    case "SET_FINISH_LOAD_WITHOUT_CONNECTED":
        return {
            ...state,
            finishLoadWithoutConnected: action.payload
        }
    case "SET_FINISH_LOAD_WITH_CONNECTED":
        return {
            ...state,
            finishLoadWithConnected: action.payload
        }
    default:
        return state
    }
}