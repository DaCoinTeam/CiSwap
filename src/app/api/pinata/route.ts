import { NextRequest, NextResponse } from "next/server"
import pinata from "./modules"
import { PinataRequestType } from "@services"
import { PinataPinOptions, PinataPinResponse } from "@pinata/sdk"
import { v4 as uuidv4 } from "uuid"
import { Readable } from "stream"
import { invalidSearchParameters } from "../shared"

export const POST = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)

    const type = searchParams.get("type") as PinataRequestType | null
    if (type === null)
        return invalidSearchParameters

    const options: PinataPinOptions = {
        pinataMetadata: {
            name: uuidv4(),
        },
        pinataOptions: {
            cidVersion: 0,
        },
    }

    let pinataResponse: PinataPinResponse
    switch (type) {
    case PinataRequestType.File:
        const formData = await request.formData()
        const file = formData.get("file") as File
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const readableStream = Readable.from(buffer)

        pinataResponse = await pinata.pinFileToIPFS(readableStream, options)
        break
    case PinataRequestType.JSON:
        const json = await request.json()
        pinataResponse = await pinata.pinJSONToIPFS(json, options)
        break
    }
    return NextResponse.json(pinataResponse)
}
