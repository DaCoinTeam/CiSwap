import { Address, Bytes } from "web3"
import Path from "./path.module"

class Quote {
    amountIn: bigint
    amountOut: bigint
    path: Path
    exactInput: boolean

    constructor(
        amountIn?: bigint,
        amountOut?: bigint,
        path?: Path,
        exactInput?: boolean
    ) {
        this.amountIn = amountIn ?? BigInt(0)
        this.amountOut = amountOut ?? BigInt(0)
        this.path = path ?? new Path()
        this.exactInput = exactInput ?? true
    }

    private getQuoteType(): QuoteType {
        const has3Steps = this.path.steps.length === 3
        const quoteTypeInput = has3Steps
            ? QuoteType.ExactInputSingle
            : QuoteType.ExactInput
        const quoteTypeOutput = has3Steps
            ? QuoteType.ExactOutputSingle
            : QuoteType.ExactOutput
        return this.exactInput ? quoteTypeInput : quoteTypeOutput
    }

    createBaseParams(): BaseParams {
        const quoteType = this.getQuoteType()

        const quoteTypeToBaseParams: Record<QuoteType, BaseParams> = {
            [QuoteType.ExactInputSingle]: {
                quoteType: QuoteType.ExactInputSingle,
                amountIn: this.amountIn,
                tokenIn: this.path.steps[0] as Address,
                tokenOut: this.path.steps[2] as Address,
                indexPool: this.path.steps[1] as number,
            },
            [QuoteType.ExactInput]: {
                quoteType: QuoteType.ExactInput,
                amountIn: this.amountIn,
                path: this.path.encodePacked(),
            },
            [QuoteType.ExactOutputSingle]: {
                quoteType: QuoteType.ExactOutputSingle,
                amountOut: this.amountIn,
                tokenIn: this.path.steps[0] as Address,
                tokenOut: this.path.steps[2] as Address,
                indexPool: this.path.steps[1] as number,
            },
            [QuoteType.ExactOutput]: {
                quoteType: QuoteType.ExactOutput,
                amountOut: this.amountIn,
                path: this.path.reverse().encodePacked(),
            },
        }

        return quoteTypeToBaseParams[quoteType]
    }
}

export default Quote


export enum QuoteType {
  ExactInputSingle,
  ExactInput,
  ExactOutputSingle,
  ExactOutput,
}

export interface ExactInputSingleBaseParams {
  quoteType: QuoteType.ExactInputSingle;
  amountIn: bigint;
  tokenIn: Address;
  tokenOut: Address;
  indexPool: number;
}

export interface ExactInputBaseParams {
  quoteType: QuoteType.ExactInput;
  amountIn: bigint;
  path: Bytes;
}

export interface ExactOutputBaseParams {
  quoteType: QuoteType.ExactOutput;
  amountOut: bigint;
  path: Bytes;
}

export interface ExactOutputSingleBaseParams {
  quoteType: QuoteType.ExactOutputSingle;
  amountOut: bigint;
  tokenIn: Address;
  tokenOut: Address;
  indexPool: number;
}

export type BaseParams =
  | ExactInputBaseParams
  | ExactInputSingleBaseParams
  | ExactOutputSingleBaseParams
  | ExactOutputBaseParams;
