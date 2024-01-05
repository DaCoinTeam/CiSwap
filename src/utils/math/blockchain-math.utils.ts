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

export interface PriceImpact {
  up: boolean;
  percentage: number;
}

export const computePriceImpact = (
    priceAfter: number,
    priceBefore: number,
    round: number = 2
): PriceImpact | null => {
    try {
        const up = priceAfter >= priceBefore
        const percentage = Math.abs(
            computeRound(computePercentage(priceAfter, priceBefore) - 100, round)
        )

        if (Number.isNaN(percentage)) {
            throw new Error("Price impact calculation resulted in NaN.")
        }

        return {
            up,
            percentage,
        }
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const computeSlippage = (
    amountRaw: bigint,
    slippage: number,
    exactInput: boolean = true,
    round: number = 5
) => {
    const amountSlippaged = computeBigIntMultiplyNumber(
        amountRaw,
        slippage,
        round
    )
    return exactInput ? amountRaw - amountSlippaged : amountRaw + amountSlippaged
}
