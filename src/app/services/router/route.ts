import { NextRequest, NextResponse } from "next/server"
import { findOptimalResult } from "./modules"
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
    const exactInput = searchParams.get("exactInput") as boolean | null
    console.log(tokenIn, tokenOut, amount, exactInput, chainId)
    if (
        chainId == null ||
    tokenIn == null ||
    tokenOut == null ||
    amount == null ||
    exactInput == null
    )
        return invalidSearchParameters

    const result = await findOptimalResult(
        chainId,
        tokenIn,
        tokenOut,
        BigInt(amount),
        exactInput
    )

    return NextResponse.json(convertBigIntsToStringsForResponse(result))
}
