import {
    computeBigIntMultiplyNumber,
    computeExponent,
    computeLeftShift,
    computeRightShift
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

export const computeDeRedenomination = (
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

export const computeSlippage = (
    amount: bigint,
    slippage: number,
    exactInput?: boolean,
    round?: number
) => {
    round = round ?? 5
    const exponent = computeExponent(round)

    const amountSlippage = computeBigIntMultiplyNumber(
        amount,
        slippage * exponent,
        round
    )
    return exactInput ? amount - amountSlippage : amount + amountSlippage
}
