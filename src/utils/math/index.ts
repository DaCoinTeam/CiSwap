import {
    computeExponent,
    computeInverse,
    computeLeftShift,
    computeBigIntMultiplyNumber,
    computeRightShift,
    computeRound,
    computeBigIntDivideNumber,
    computeBigIntDivideBigInt,
    computePercentage
} from "./base-math.util"

import {
    computeDeRedenomination,
    computeDivideX96,
    computeMultiplyX96,
    computePriceImpact,
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
    computeBigIntDivideBigInt: computeBigIntDivideBigInt,
    computePercentage: computePercentage,
    computeDeRedenomination: computeDeRedenomination,
    computeDivideX96: computeDivideX96,
    computeMultiplyX96: computeMultiplyX96,
    computeRedenomination: computeRedenomination,
    computeSlippage: computeSlippage,
    computePriceImpact: computePriceImpact
}

export default mathUtils