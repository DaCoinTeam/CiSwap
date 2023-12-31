import axios from "axios"
import { Address } from "web3"
import { TokenDTO } from "./token.dto"

export const getTokenApi = async (token: Address, chainId: number) : Promise<TokenDTO | null> => {
    try {
        const response = await axios.get("/api/token", {
            params: {
                token,
                chainId,
            },
        })
        
        return response.data as TokenDTO
    } catch (error) {
        console.error(error)
        return null
    }
}   
