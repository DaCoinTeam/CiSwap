import {
    computeBigIntMultiplyNumber,
    computeExponent,
    computeLeftShift,
    computePercentage,
    computeRightShift,
    computeRound,
} from "./base-math.util"

export const computeRedenomination = (
    amount: bigint,
    decimals: number,
    round?: number
): number => {
    round = round ?? 5
    try {
        const divisor = computeExponent(decimals)
        const result =
      Number((amount * BigInt(computeExponent(round))) / BigInt(divisor)) /
      computeExponent(round)

        return result
    } catch (error) {
        console.error(error)
        return 0
    }
}

export const computeRaw = (
    amount: number,
    decimals: number,
    precision?: number
): bigint => {
    precision = precision ?? 5
    try {
        const exponent = computeExponent(decimals)
        const result = computeBigIntMultiplyNumber(
            BigInt(exponent),
            amount,
            precision
        )
        if (isNaN(Number(result))) throw new Error()
        return result
    } catch (error) {
        console.error(error)
        return BigInt(0)
    }
}

export const computeMultiplyX96 = (value: number): bigint =>
    computeLeftShift(value, 96)

export const computeDivideX96 = (value: bigint): number =>
    computeRightShift(value, 96)

export const computePriceImpact = (
    actualRatio: number,
    baseRatio: number,
    round?: number
): number => {
    try {
        round = round ?? 2
        const result = computeRound(computePercentage(actualRatio, baseRatio) - 100, round)
            
        if (Number.isNaN(result)) {
            throw new Error()
        }
        return result
    } catch (ex) {
        return 0
    }
}

export const computeSlippage = (
    amountRaw: bigint,
    slippage: number,
    exactInput?: boolean,
    round?: number
) => {
    round = round ?? 5

    const amountSlippaged = computeBigIntMultiplyNumber(
        amountRaw,
        slippage,
        round
    )
    return exactInput ? amountRaw - amountSlippaged : amountRaw + amountSlippaged
}
