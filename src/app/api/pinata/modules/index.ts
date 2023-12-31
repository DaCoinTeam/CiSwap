import pinataSDK from "@pinata/sdk"

const pinata = new pinataSDK({
    pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY, 
    pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY_SECRET 
})

export default pinata