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
    console.log(tokenIn, tokenOut, amount, exactInput, chainId)

    if (chainId == null || tokenIn == null || tokenOut == null || amount == null)
        return invalidSearchParameters

    if (exactInput == null) {
        exactInput = true
    }

    const smartRouter = new SmartRouter(chainId)

    let response: BestRouteResult | null

    const quoteType: QuoteType = exactInput
        ? QuoteType.ExactInput
        : QuoteType.ExactOutput

    switch (quoteType) {
    case QuoteType.ExactInput:
        response = await smartRouter.findBestRouteExactInput(
            BigInt(amount),
            tokenIn,
            tokenOut
        )
        break
    case QuoteType.ExactOutput:
        response = await smartRouter.findBestRouteExactOutput(
            BigInt(amount),
            tokenIn,
            tokenOut
        )
        break
    }

    return NextResponse.json(convertBigIntsToStringsForResponse(response))
}
