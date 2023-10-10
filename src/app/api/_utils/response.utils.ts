import axios from "axios"

export enum ResponseStatus {
  OK = 200,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
}

export const headers = {

}

export const createEmptyResponse = (status: ResponseStatus) => {
    return new Response("", {
        status,
    })
}

export const createSVGResponse = (data: string) => {
    return new Response(data, {
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
