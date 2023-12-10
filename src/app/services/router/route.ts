import { NextRequest, NextResponse } from "next/server"
import { findPathsOut } from "./modules"
import { ChainId } from "@config"
import { Address } from "web3"
import { invalidSearchParameters } from "../shared"
import { serializeBigInt } from "@utils"

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get("chainId") as ChainId | null
    const tokenInAddress = searchParams.get("tokenInAddress") as Address | null
    const tokenOutAddress = searchParams.get("tokenOutAddress") as Address | null
    const tokenAmount = searchParams.get("tokenAmount") as bigint | null
    const _in = searchParams.get("in") as boolean | null

    if (chainId == null || tokenInAddress == null || tokenOutAddress == null
        || tokenAmount == null || _in == null)
        return invalidSearchParameters

    const results = await findPathsOut(chainId, tokenInAddress, tokenOutAddress, tokenAmount)
    
    return NextResponse.json({
        path: serializeBigInt(results),
    })
}
