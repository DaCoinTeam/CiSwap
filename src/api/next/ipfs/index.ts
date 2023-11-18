import axios from "axios"

export const getIpfsJson = async (CID: string) : Promise<unknown|null> => {
    const response = await axios.get(buildIpfsUrl(CID))
    return response.data
}

export const getIpfsImageBlobUrl = async (CID: string) : Promise<string|null> => {
    const response = await axios.get(buildIpfsUrl(CID), { responseType: "arraybuffer" })
    const blob = new Blob([response.data], { type: response.headers["content-type"] })
    return URL.createObjectURL(blob)
}

const IPFS_URL = "https://ipfs.io/ipfs/"
export const buildIpfsUrl = (CID: string) => `${IPFS_URL}${CID}` 