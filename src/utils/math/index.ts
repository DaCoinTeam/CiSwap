import {
    computeExponent,
    computeInverse,
    computeLeftShift,
    computeBigIntMultiplyNumber,
    computeRightShift,
    computeRound,
    computeBigIntDivideNumber,
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
    computeBigIntMultiplyNumber: computeBigIntMultiplyNumber,
    computeBigIntDivideNumber: computeBigIntDivideNumber,
    computeDeRedenomination: computeDeRedenomination,
    computeDivideX96: computeDivideX96,
    computeMultiplyX96: computeMultiplyX96,
    computeRedenomination: computeRedenomination,
    computeSlippage: computeSlippage,
}

export default mathUtils