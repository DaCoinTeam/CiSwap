import {
    ResponseStatus,
    createEmptyResponse,
    createSVGResponse,
} from "../../../../../utils/api"
import { getTokenDoc } from "@firebase"
import { NextResponse, type NextRequest } from "next/server"
import axios from "axios"

export const GET = async (request: NextRequest) : Promise<NextResponse> => {
    try {
        const searchParams = request.nextUrl.searchParams
        const tokenAddress = searchParams.get("tokenAddress") as string
        const chainId = searchParams.get("chainId") as string

        const tokenDoc = await getTokenDoc(
            tokenAddress,
            Number.parseInt(chainId)
        )

        if (!tokenDoc) {
            return createEmptyResponse(ResponseStatus.NotFound)
        }

        const data = await axios.get(tokenDoc.tokenImageUrl)

        return createSVGResponse(data.data.toString())
    } catch (ex) {
        console.log(ex)
        return createEmptyResponse(ResponseStatus.InternalServerError)
    }
}
