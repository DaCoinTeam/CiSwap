import axios from "axios"
import { NextResponse } from "next/server"

export enum ResponseStatus {
  OK = 200,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
}

export const headers = {

}

export const createEmptyResponse = (status: ResponseStatus) => {
    return new NextResponse("", {
        status,
    })
}

export const createSVGResponse = (data: string) => {
    return new NextResponse(data, {
        status: ResponseStatus.OK,
        headers: {
            "Content-Type": "image/svg+xml",
        },
    })
}

export const getSvgResponse = async (url: string) => {
    const response = await axios.get(url, {
        responseType: "text"
    })
    const blob = new Blob([response.data], {type: "image/svg+xml"})
    return URL.createObjectURL(blob)
}
