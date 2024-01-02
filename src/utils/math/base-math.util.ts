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
    round?: number
): number => {
    round = round ?? 5
    return (
        Number(
            (BigInt(value) * BigInt(computeExponent(round))) >> BigInt(numberOfBits)
        ) / computeExponent(round)
    )
}

export const computeInverse = (value: number, round: number): number => {
    try {
        if (value === 0) return 0
        const result = Number.parseFloat((1 / value).toFixed(round))

        return result
    } catch (ex) {
        console.error(ex)
        return 0
    }
}

export const computeRound = (
    value: number | string,
    round?: number
): number => {
    try {
        return Number(Number.parseFloat(value.toString()).toFixed(round))
    } catch (ex) {
        console.error(ex)
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
    } catch (ex) {
        console.error(ex)
        return BigInt(0)
    }
}

export const computeBigIntDivideNumber = (
    bigint: bigint,
    number: number,
    round?: number
): bigint => {
    try {
        round = round ?? 5
        return (
            (bigint * BigInt(computeExponent(round))) /
      BigInt(computeRound(number * computeExponent(round)))
        )
    } catch (ex) {
        console.error(ex)
        return BigInt(0)
    }
}

export const computePercentage = (
    numerator: number,
    denominator: number,
    round: number = 2
) => {
    return computeRound((numerator / denominator) * 100, round)
}

export const computeBigIntDivideBigInt = (
    numerator: bigint,
    denominator: bigint,
    round?: number
): number => {
    try {
        round = round ?? 5
        return Number(
            (numerator * BigInt(computeExponent(round))) /
            denominator
        ) / computeExponent(round)
    } catch (ex) {
        //console.error(ex)
        return 0
    }
}