export const computeExponent = (y: number): number => Math.pow(10, y)

export const computeLeftShift = (
    value: number,
    numberOfBits: number
): bigint => {
    return BigInt(value) << BigInt(numberOfBits)
}

export const computeRightShift = (
    value: bigint,
    numberOfBits: number,
    precision?: number
): number => {
    precision = precision ?? 5
    return (
        Number(
            (BigInt(value) * BigInt(computeExponent(precision))) >>
        BigInt(numberOfBits)
        ) / computeExponent(precision)
    )
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

export const computeRound = (
    value: number | string,
    round?: number
): number => {
    try {
        return Number(Number.parseFloat(value.toString()).toFixed(round))
    } catch (error) {
        console.error(error)
        return 0
    }
}

export const computeBigIntMultiplyNumber = (
    bigint: bigint,
    number: number,
    precision?: number
): bigint => {
    try {
        precision = precision ?? 5
        return (
            (bigint * BigInt(computeRound(number * computeExponent(precision)))) /
      BigInt(computeExponent(precision))
        )
    } catch (error) {
        console.error(error)
        return BigInt(0)
    }
}

export const computeBigIntDivideNumber = (
    bigint: bigint,
    number: number,
    precision?: number
): bigint => {
    try {
        precision = precision ?? 5
        return (
            (bigint * BigInt(computeExponent(precision))) /
      BigInt(computeRound(number * computeExponent(precision)))
        )
    } catch (error) {
        console.error(error)
        return BigInt(0)
    }
}
