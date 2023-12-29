export const computeExponent = (y: number): number =>
    Math.pow(10, y)

export const computeDivBigInt = (
    numerator: bigint,
    denominator: bigint,
    round: number
): number => {
    try {
        const result =
      Number((numerator * BigInt(computeExponent(round))) / denominator) /
      computeExponent(round)

        return result
    } catch (error) {
        console.error(error)
        return 0
    }
}

export const computeLeftShift = (
    value: number,
    numberOfBits: number
): bigint => {
    return BigInt(value) << BigInt(numberOfBits)
}

export const computeRightShift = (
    value: bigint,
    numberOfBits: number
): number => {
    return Number(BigInt(value) >> BigInt(numberOfBits))
}

export const computeInverse = (value: number, round: number): number => {
    try {
        if (value === 0) return 0
        const result = Number.parseFloat((1 / value).toFixed(round))

        return result
    } catch (error) {
        console.error(error)
        return 0
    }
}

export const computeRound = (value: number | string, round: number): number => {
    try {
        return Number(Number.parseFloat(value.toString()).toFixed(round))
    } catch (error) {
        console.error(error)
        return 0
    }
}

export const computeMultiplyBigIntAndNumber = (
    baseValue: bigint,
    exponent: number,
    round: number
): bigint => {
    try {
        return (
            (baseValue * BigInt(exponent * computeExponent(round))) /
      BigInt(computeExponent(round))
        )
    } catch (error) {
        console.error(error)
        return BigInt(0)
    }
}

export const computePercentage = (
    currentValue: number,
    totalValue: number,
    round: number
): number => {
    try {
        return Number(
            (Math.abs(1 - currentValue / totalValue) * 100).toFixed(round)
        )
    } catch (error) {
        console.error(error)
        return 0
    }
}
