import { NextRequest, NextResponse } from "next/server"
import { SmartRouter } from "./modules"
import { ChainId } from "@config"
import { Address } from "web3"
import { invalidSearchParametersError, notFoundError } from "../shared"
import { convertBigIntsToStringsForResponse } from "@utils"

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url)
        const chainId = searchParams.get("chainId") as ChainId | null
        const tokenIn = searchParams.get("tokenIn") as Address | null
        const tokenOut = searchParams.get("tokenOut") as Address | null
        const amount = searchParams.get("amount") as string | null
        let exactInput = searchParams.get("exactInput") as boolean | null
        console.log(tokenIn, tokenOut, amount, exactInput, chainId)

        if (
            chainId == null ||
      tokenIn == null ||
      tokenOut == null ||
      amount == null
        )
            return invalidSearchParametersError

        if (exactInput == null) {
            exactInput = true
        }

        const smartRouter = new SmartRouter(chainId)

        const response = await smartRouter.findBestQuote(
            BigInt(amount),
            tokenIn,
            tokenOut,
            exactInput
        )

        return NextResponse.json(convertBigIntsToStringsForResponse(response))
    } catch (ex) {
        return notFoundError(ex)
    }
}
