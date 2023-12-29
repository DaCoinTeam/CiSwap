export interface BigIntElement {
  index: number;
  value: bigint;
}

export const findMaxBigIntIndexAndValue = (array: bigint[]): BigIntElement => {
    if (array.length === 0) {
        throw new Error("Cannot find maximum index in an empty array")
    }

    let maxIndex = 0
    for (let i = 1; i < array.length; i++) {
        if (array[i] > array[maxIndex]) {
            maxIndex = i
        }
    }
    const value = array[maxIndex]

    return {
        index: maxIndex,
        value
    }
}

export const findMinBigIntIndexAndValue = (array: bigint[]): BigIntElement => {
    if (array.length === 0) {
        throw new Error("Cannot find minimum index in an empty array")
    }

    let minIndex = 0
    for (let i = 1; i < array.length; i++) {
        if (array[i] < array[minIndex]) {
            minIndex = i
        }
    }
    const value = array[minIndex]

    return {
        index: minIndex,
        value
    }
}
