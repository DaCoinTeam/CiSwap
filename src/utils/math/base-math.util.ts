export const computeExponent = (y: number): number => Math.pow(10, y)

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