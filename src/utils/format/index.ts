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

const parseNumber = (string: string): number => {
    const parseValue = Number.parseFloat(string)
    if (Number.isNaN(parseValue) || !Number.isFinite(parseValue)) {
        return 0
    }
    return parseValue
}

const formatUtils = {
    sanitizeNumericInput : sanitizeNumericInput,
    shortenAddress : shortenAddress,
    parseNumber : parseNumber
}

export default formatUtils