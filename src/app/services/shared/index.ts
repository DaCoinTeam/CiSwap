import { NextResponse } from "next/server"

export const invalidSearchParametersError = new NextResponse(
    "Invalid search parameters",
    {
        status: 400,
    }
)

export const notFoundError = (ex: unknown) =>
    new NextResponse((ex as Error).message, {
        status: 404,
    })
