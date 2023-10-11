import { NextRequest } from "next/server"
import { ResponseStatus, createEmptyResponse } from "@utils"

export const middleware = (request: NextRequest) => {
    if (request.nextUrl.pathname.startsWith("/api/static/images/token")) {
        const searchParams = request.nextUrl.searchParams
        const tokenAddress = searchParams.get("tokenAddress")
        const chainId = searchParams.get("chainId")

        if (tokenAddress == null || chainId == null) {
            return createEmptyResponse(ResponseStatus.BadRequest)
        }
    }
}

export const config = {
    matcher: ["/api/static/images/token"]
}