import { Address, Bytes, utils } from "web3"

const sanitizeNumericInput = (input: string): string | null => {
    const regex = new RegExp(/^\d*[.,]?\d*$/)
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

const parseNumberToString = (number: number): string =>
    number !== 0 ? number.toString() : ""

const parseStringToNumberMultiply = (
    string: string,
    multiply: number,
    defaultValue?: number
): string => {
    let parsedNumber = parseStringToNumber(string, defaultValue)
    parsedNumber *= multiply
    return parseNumberToString(parsedNumber)
}

const bytesToAddress = (bytes: Bytes): Address => {
    const hexString = utils.bytesToHex(bytes)
    return utils.toChecksumAddress(`0x${hexString.slice(26)}`)
}

const bytesToBigInt = (bytes: Bytes): bigint =>
    BigInt(utils.hexToNumber(utils.bytesToHex(bytes)))

const bytesToNumber = (bytes: Bytes): number =>
    Number(utils.hexToNumber(utils.bytesToHex(bytes)))

const format = {
    sanitizeNumericInput,
    shortenAddress,
    parseStringToNumber,
    parseNumberToString,
    parseStringToNumberMultiply,
    bytesToBigInt,
    bytesToAddress,
    bytesToNumber,
}

export default format
