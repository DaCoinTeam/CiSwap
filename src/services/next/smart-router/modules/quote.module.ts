import { Address } from "web3"
import Path from "./path.module"
import { math, time } from "@utils"
import { ParamsScenario, QuoteType } from "../shared"

export default class Quote {
    amountInRaw: bigint
    amountOutRaw: bigint
    path: Path
    exactInput: boolean

    constructor(
        amountInRaw?: bigint,
        amountOutRaw?: bigint,
        path?: Path,
        exactInput?: boolean
    ) {
        this.amountInRaw = amountInRaw ?? BigInt(0)
        this.amountOutRaw = amountOutRaw ?? BigInt(0)
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

    getSwapScenario(
        slippage: number,
        recipient: Address,
        txDeadline: number
    ): ParamsScenario {
        const quoteType = this.getQuoteType()
        
        const deadline = time.currentSeconds() + txDeadline * 60
        
        const quoteTypeToScenario: Record<QuoteType, ParamsScenario> = {
            [QuoteType.ExactInputSingle]: {
                quoteType: QuoteType.ExactInputSingle,
                params: {
                    amountIn: this.amountInRaw,
                    amountOutMin: math.blockchain.computeSlippaged(
                        this.amountOutRaw,
                        slippage
                    ),
                    recipient: recipient,
                    tokenIn: this.path.steps[0] as Address,
                    tokenOut: this.path.steps[2] as Address,
                    indexPool: this.path.steps[1] as number,
                    deadline: deadline,
                },
            },
            [QuoteType.ExactInput]: {
                quoteType: QuoteType.ExactInput,
                params: {
                    amountIn: this.amountInRaw,
                    amountOutMin: math.blockchain.computeSlippaged(
                        this.amountOutRaw,
                        slippage
                    ),
                    recipient: recipient,
                    path: this.path.encodePacked(),
                    deadline: deadline,
                },
            },
            [QuoteType.ExactOutputSingle]: {
                quoteType: QuoteType.ExactOutputSingle,
                params: {
                    amountOut: this.amountOutRaw,
                    amountInMax: math.blockchain.computeSlippaged(this.amountInRaw, slippage, false),
                    recipient: recipient,
                    tokenIn: this.path.steps[0] as Address,
                    tokenOut: this.path.steps[2] as Address,
                    indexPool: this.path.steps[1] as number,
                    deadline: deadline,
                },
            },
            [QuoteType.ExactOutput]: {
                quoteType: QuoteType.ExactOutput,
                params: {
                    amountOut: this.amountOutRaw,
                    amountInMax: math.blockchain.computeSlippaged(this.amountInRaw, slippage, false),
                    recipient: recipient,
                    path: this.path.reverse().encodePacked(),
                    deadline: deadline,
                },
            },
        }
        return quoteTypeToScenario[quoteType]
    }
}

