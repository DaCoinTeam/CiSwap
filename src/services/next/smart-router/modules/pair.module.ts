import { Address } from "web3"

export default class Pair {
    tokenStart: Address
    tokenEnd: Address

    constructor(tokenStart: Address, tokenEnd: Address) {
        this.tokenStart = tokenStart
        this.tokenEnd = tokenEnd
    }

    compare(pair: Pair): boolean {
        return (
            (this.tokenStart === pair.tokenStart && this.tokenEnd === pair.tokenEnd) ||
      (this.tokenStart === pair.tokenEnd && this.tokenEnd === pair.tokenStart)
        )
    }
}

