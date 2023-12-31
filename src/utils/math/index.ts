import {
    computeExponent,
    computeInverse,
    computeLeftShift,
    computeRightShift,
    computeRound,
} from "./base-math.util"

import {
    computeDeRedenomination,
    computeDivideX96,
    computeMultiplyX96,
    computeRedenomination,
    computeSlippage,
} from "./blockchain-math.utils"

const mathUtils = {
    computeExponent: computeExponent,
    computeInverse: computeInverse,
    computeLeftShift: computeLeftShift,
    computeRightShift: computeRightShift,
    computeRound: computeRound,
    computeDeRedenomination: computeDeRedenomination,
    computeDivideX96: computeDivideX96,
    computeMultiplyX96: computeMultiplyX96,
    computeRedenomination: computeRedenomination,
    computeSlippage: computeSlippage,
}

export default mathUtils