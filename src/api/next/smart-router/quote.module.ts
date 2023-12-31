import web3, { Address, Bytes, Sha3Input } from "web3"
import { computeSlippage } from "../../../utils/math"

class Quote {
    amountIn: bigint
    amountOut: bigint
    path: Step[]
    exactInput: boolean

    constructor(
        amountIn: bigint,
        amountOut: bigint,
        path: Step[],
        exactInput?: boolean
    ) {
        this.amountIn = amountIn
        this.amountOut = amountOut
        this.path = path
        this.exactInput = exactInput ?? true
    }

    private getQuoteType(): QuoteType {
        const has3Steps = this.path.length == 3
        const quoteTypeInput = has3Steps
            ? QuoteType.ExactInputSingle
            : QuoteType.ExactInput
        const quoteTypeOutput = has3Steps
            ? QuoteType.ExactOutputSingle
            : QuoteType.ExactOutput
        return this.exactInput ? quoteTypeInput : quoteTypeOutput
    }

    private encodePacked(): Bytes {
        const pathCloned = Object.assign([], this.path)
        if (this.exactInput) {
            pathCloned.reverse()
        }

        const inputs: Sha3Input[] = this.path.map((step) => {
            if (typeof step == "number") {
                return { type: "uint32", value: step }
            }
            return { type: "address", value: step }
        })
        return web3.utils.encodePacked(...inputs)
    }

    createPrimaryParams(slippage: number): PrimaryParams {
        const quoteType = this.getQuoteType()

        const quoteTypeToParams: Record<QuoteType, PrimaryParams> = {
            [QuoteType.ExactInputSingle]: {
                quoteType: QuoteType.ExactInputSingle,
                amountIn: this.amountIn,
                amountOutMin: computeSlippage(this.amountOut, slippage, 3, true),
                tokenIn: this.path[0] as Address,
                tokenOut: this.path[2] as Address,
                indexPool: this.path[1] as number,
            },
            [QuoteType.ExactInput]: {
                quoteType: QuoteType.ExactInput,
                amountIn: this.amountIn,
                amountOutMin: computeSlippage(this.amountOut, slippage, 3, true),
                path: this.encodePacked(),
            },
            [QuoteType.ExactOutputSingle]: {
                quoteType: QuoteType.ExactOutputSingle,
                amountOut: this.amountIn,
                amountInMax: computeSlippage(this.amountOut, slippage, 3),
                tokenIn: this.path[0] as Address,
                tokenOut: this.path[2] as Address,
                indexPool: this.path[1] as number,
            },
            [QuoteType.ExactOutput]: {
                quoteType: QuoteType.ExactOutput,
                amountOut: this.amountIn,
                amountInMax: computeSlippage(this.amountOut, slippage, 3),
                path: this.encodePacked(),
            },
        }

        return quoteTypeToParams[quoteType]
    }
}

export default Quote

export type Step = Address | number;

export enum QuoteType {
  ExactInputSingle,
  ExactInput,
  ExactOutputSingle,
  ExactOutput,
}

export interface ExactInputSinglePrimaryParams {
  quoteType: QuoteType.ExactInputSingle;
  amountIn: bigint;
  amountOutMin: bigint;
  tokenIn: Address;
  tokenOut: Address;
  indexPool: number;
}

export interface ExactInputPrimaryParams {
  quoteType: QuoteType.ExactInput;
  amountIn: bigint;
  amountOutMin: bigint;
  path: Bytes;
}

export interface ExactOutputPrimaryParams {
  quoteType: QuoteType.ExactOutput;
  amountOut: bigint;
  amountInMax: bigint;
  path: Bytes;
}

export interface ExactOutputSinglePrimaryParams {
  quoteType: QuoteType.ExactOutputSingle;
  amountOut: bigint;
  amountInMax: bigint;
  tokenIn: Address;
  tokenOut: Address;
  indexPool: number;
}

export type PrimaryParams =
  | ExactInputPrimaryParams
  | ExactInputSinglePrimaryParams
  | ExactOutputSinglePrimaryParams
  | ExactOutputPrimaryParams;
