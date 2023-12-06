import axios from "axios"

export const getIpfsJson = async (cid: string) : Promise<unknown|null> => {
    const response = await axios.get(buildIpfsUrl(cid))
    return response.data
}

export const getIpfsImageBlobUrl = async (cid: string) : Promise<string|null> => {
    const response = await axios.get(buildIpfsUrl(cid), { responseType: "arraybuffer" })
    const blob = new Blob([response.data], { type: response.headers["content-type"] })
    return URL.createObjectURL(blob)
}

const IPFS_URL = "https://ipfs.io/ipfs/"
export const buildIpfsUrl = (cid: string) => `${IPFS_URL}${cid}` 