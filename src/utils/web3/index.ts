import web3, { Address, Bytes } from "web3"

export const bytesToAddress = (bytes: Bytes): Address => {
    const hexString = web3.utils.bytesToHex(bytes)
    return web3.utils.toChecksumAddress(`0x${hexString.slice(26)}`)
}