import web3, { Address } from "web3"

class Pair {
    tokenStart: Address
    tokenEnd: Address

    constructor(tokenStart: Address, tokenEnd: Address) {
        this.tokenStart = tokenStart
        this.tokenEnd = tokenEnd
    }

    zeroForOne(): boolean {
        return (
            web3.utils.hexToNumber(this.tokenStart) <
      web3.utils.hexToNumber(this.tokenEnd)
        )
    }

    compare(pair: Pair): boolean {
        return (
            (this.tokenStart == pair.tokenStart && this.tokenEnd == pair.tokenEnd) ||
      (this.tokenStart == pair.tokenEnd && this.tokenEnd == pair.tokenStart)
        )
    }
}
export default Pair
