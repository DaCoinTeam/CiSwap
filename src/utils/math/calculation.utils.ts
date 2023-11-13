export const calculateExponent = (y: number): number => Math.pow(10, y)

export const calculateRedenomination = (
    amount: bigint,
    decimals: number,
    round: number
): number => {
    try {
        const divisor = calculateExponent(decimals)
        const result =
      Number((amount * BigInt(calculateExponent(round))) / BigInt(divisor)) /
      calculateExponent(round)

        return result
    } catch (ex) {
        console.error(ex)
        return 0
    }
}

export const calculateDivBigInt = (
    _a: bigint,
    _b: bigint,
    round: number
): number => {
    try {
        const result =
      Number((_a * BigInt(calculateExponent(round))) / _b) /
      calculateExponent(round)

        return result
    } catch (ex) {
        console.error(ex)
        return 0
    }
}

export const calculateIRedenomination = (
    amount: number,
    decimals: number
): bigint => {
    try {
        const result = BigInt(amount * calculateExponent(decimals))
        if (isNaN(Number(result))) throw new Error()
        return result
    } catch (error) {
        console.error(error)
        return BigInt(0)
    }
}

export const calculateInverse = (y: number, round: number): number => {
    try {
        if (y === 0) return 0
        const result = Number.parseFloat((1 / y).toFixed(round))

        return result
    } catch (ex) {
        console.error(ex)
        return 0
    }
}

export const calculateRound = (y: number | string, round: number): number => {
    try {
        return Number(Number.parseFloat(y.toString()).toFixed(round))
    } catch (ex) {
        console.error(ex)
        return 0
    }
}

export const calculateMuvBigIntNumber = (
    x: bigint,
    y: number,
    round: number
): bigint => {
    try {
        return (
            (x * BigInt(y * calculateExponent(round))) /
      BigInt(calculateExponent(round))
        )
    } catch (ex) {
        console.error(ex)
        return BigInt(0)
    }
}

export const calculatePercentage = (
    x: number,
    y: number,
    round: number
): number => {
    try {
        return Number((Math.abs(1 - x / y) * 100).toFixed(round))
    } catch (ex) {
        console.log(ex)
        return 0
    }
}
