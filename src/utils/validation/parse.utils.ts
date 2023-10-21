export const parseNumber = (string: string): number => {
    const parseValue = Number.parseFloat(string)
    if (Number.isNaN(parseValue) || !Number.isFinite(parseValue)) {
        return 0
    }
    return parseValue
}
