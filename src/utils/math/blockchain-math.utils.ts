import {
    computeExponent,
    computeLeftShift,
    computeRightShift,
} from "./base-math.util"

export const computeRedenomination = (
    amount: bigint,
    decimals: number,
    round: number
): number => {
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
    decimals: number
): bigint => {
    try {
        const result = BigInt(amount * computeExponent(decimals))
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
