import { Address } from "web3"

const sanitizeNumericInput = (input: string): string | null => {
    const regex = /^[0-9]*[.,]?[0-9]*$/
    if (!regex.test(input)) {
        return null
    }
    const sanitizedValue = input.replace(/,/g, ".")
    return sanitizedValue
}

const shortenAddress = (account: Address) =>
    `${account.slice(0, 4)}...${account.slice(-2)}`

const parseStringToNumber = (string: string, defaultValue?: number): number => {
    const parseValue = Number.parseFloat(string)
    if (Number.isNaN(parseValue) || !Number.isFinite(parseValue)) {
        return defaultValue ?? 0
    }
    return parseValue
}

const parseNumberToString = (number: number): string => number !== 0 ? number.toString() : ""

const getParsedNumberMultiply = (
    stringNumber: string,
    multiply: number
): string => {
    let parsedNumber = parseStringToNumber(stringNumber)
    parsedNumber *= multiply
    return parseNumberToString(parsedNumber)
}

const formatUtils = {
    sanitizeNumericInput: sanitizeNumericInput,
    shortenAddress: shortenAddress,
    parseStringToNumber: parseStringToNumber,
    parseNumberToString: parseNumberToString,
    getParsedNumberMultiply: getParsedNumberMultiply
}

export default formatUtils
