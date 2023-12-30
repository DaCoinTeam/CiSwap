import { NextRequest, NextResponse } from "next/server"
import { BestRouteResult, QuoteType, SmartRouter } from "./modules"
import { ChainId } from "@config"
import { Address } from "web3"
import { invalidSearchParameters } from "../shared"
import { convertBigIntsToStringsForResponse } from "@utils"

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get("chainId") as ChainId | null
    const tokenIn = searchParams.get("tokenIn") as Address | null
    const tokenOut = searchParams.get("tokenOut") as Address | null
    const amount = searchParams.get("amount") as string | null
    let exactInput = searchParams.get("exactInput") as boolean | null
    let single = searchParams.get("single") as boolean | null
    console.log(tokenIn, tokenOut, amount, exactInput, chainId)

    if (chainId == null || tokenIn == null || tokenOut == null || amount == null)
        return invalidSearchParameters

    if (exactInput == null || single == null) {
        exactInput = true
        single = true
    }

    const smartRouter = new SmartRouter(chainId)

    let response: BestRouteResult | null

    const quoteTypeInput: QuoteType = single
        ? QuoteType.ExactInputSingle
        : QuoteType.ExactInput
    const quoteTypeOutput: QuoteType = single
        ? QuoteType.ExactOutputSingle
        : QuoteType.ExactOutput
    const quoteType: QuoteType = exactInput ? quoteTypeInput : quoteTypeOutput

    switch (quoteType) {
    case QuoteType.ExactInputSingle:
        response = await smartRouter.findBestRouteExactInputSingle(
            BigInt(amount),
            tokenIn,
            tokenOut
        )
        break
    case QuoteType.ExactInput:
        response = await smartRouter.findBestRouteExactInput(
            BigInt(amount),
            tokenIn,
            tokenOut
        )
        break
    case QuoteType.ExactOutputSingle:
        response = await smartRouter.findBestRouteExactOutputSingle(
            BigInt(amount),
            tokenIn,
            tokenOut
        )
        break
    case QuoteType.ExactOutput:
        response = await smartRouter.findBestRouteExactInputSingle(
            BigInt(amount),
            tokenIn,
            tokenOut
        )
    }

    return NextResponse.json(convertBigIntsToStringsForResponse(response))
}
