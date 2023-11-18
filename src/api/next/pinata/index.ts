import { PinataPinResponse } from "@pinata/sdk"
import axios from "axios"

const PINATA_URL = "/api/next/pinata"
export const pinataGET = async () => {

}
export const pinataPOSTFile = async (file: File) : Promise<PinataPinResponse|null> => {
    const searchParams = new URLSearchParams()
    searchParams.append("type", PinataRequestType.File)
    const url = `${PINATA_URL}?${searchParams.toString()}`

    const formData = new FormData()
    formData.append("file", file)

    //try {
    const response = await axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })

    return response.data as PinataPinResponse
    // } catch (ex) {
    //     console.error(ex)
    //     return null
    // }
}

export const pinataPOSTJson = async (json: unknown) : Promise<PinataPinResponse|null> => {
    const searchParams = new URLSearchParams()
    searchParams.append("type", PinataRequestType.JSON)
    const url = `${PINATA_URL}?${searchParams.toString()}`

    try {
        const response = await axios.post(url, json, {
            headers: {
                "Content-Type": "application/json",
            },
        })

        return response.data as PinataPinResponse
    } catch (ex) {
        console.error(ex)
        return null
    }
}

export enum PinataRequestType {
    JSON = "json",
    File = "file"
}

