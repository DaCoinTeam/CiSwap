import { ResponseStatus, createEmptyResponse, createSVGResponse } from "@app/api/_utils"
import { getTokenDoc } from "@firebase"
import { type NextRequest } from "next/server"
import axios from "axios"

export const GET = async (request: NextRequest) => {
    try {
        const searchParams = request.nextUrl.searchParams
        const tokenAddress = searchParams.get("tokenAddress")
        const chainId = searchParams.get("chainId")

        if (tokenAddress == null || chainId == null) {
            return createEmptyResponse(ResponseStatus.BadRequest)
        }

        const tokenDoc = await getTokenDoc(tokenAddress, Number.parseInt(chainId))
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
