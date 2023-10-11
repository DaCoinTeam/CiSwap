import axios from "axios"

export const fetchAndCreateSvgBlobUrl = async (url: string) => {
    try {
        const response = await axios.get(url, {
            responseType: "text"
        })
        const blob = new Blob([response.data], { type: "image/svg+xml" })
        return URL.createObjectURL(blob)
    } catch (ex) {
        console.log(ex)
        return null
    }       
}

