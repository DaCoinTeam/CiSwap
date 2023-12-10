import { NextResponse } from "next/server"

export const invalidSearchParameters = new NextResponse(
    "Invalid search parameters",
    {
        status: 400,
    }
)
