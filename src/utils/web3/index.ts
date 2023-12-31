import web3, { Address, Bytes } from "web3"

const bytesToAddress = (bytes: Bytes): Address => {
    const hexString = web3.utils.bytesToHex(bytes)
    return web3.utils.toChecksumAddress(`0x${hexString.slice(26)}`)
}

const bytesToBigInt = (bytes: Bytes): bigint =>
    BigInt(web3.utils.hexToNumber(web3.utils.bytesToHex(bytes)))

const bytesToNumber = (bytes: Bytes): number =>
    Number(web3.utils.hexToNumber(web3.utils.bytesToHex(bytes)))

const web3Utils = {
    bytesToAddress: bytesToAddress,
    bytesToBigInt: bytesToBigInt,
    bytesToNumber: bytesToNumber,
}

export default web3Utils
