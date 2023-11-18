import axios from "axios"
import { Address } from "web3"
import { TokenDTO } from "./token.dto"

export const getTokenApi = async (tokenAddress: Address, chainId: number) : Promise<TokenDTO | null> => {
    try {
        const response = await axios.get("/api/token", {
            params: {
                tokenAddress,
                chainId,
            },
        })
        
        return response.data as TokenDTO
    } catch (error) {
        console.error(error)
        return null
    }
}   
