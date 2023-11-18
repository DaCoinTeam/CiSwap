import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
} from "firebase/firestore"
import { db } from "@3rd"
import { Address } from "web3"

export const addTokenDoc = async (
    tokenAddress: Address,
    tokenImageUrl: string
): Promise<boolean> => {
    try {
        await addDoc(collection(db, "Tokens"), {
            tokenAddress,
            tokenImageUrl,
        })
        return true
    } catch (ex) {
        console.log(ex)
        return false
    }
}

interface TokenDoc {
    tokenAddress: Address,
    chainId: number,
    tokenImageUrl: string
}

export const getTokenDoc = async (
    tokenAddress: Address, 
    chainId: number

) : Promise<TokenDoc|null> => {
    try{
        const collectionRef = collection(db, "Tokens")
        const q = query(
            collectionRef,
            where("tokenAddress", "==", tokenAddress),
            where("chainId", "==", chainId)
        )
    
        const querySnapshot = await getDocs(q)

        if (querySnapshot.size == 0) return null 
        return querySnapshot.docs[0].data() as TokenDoc
    } catch(ex){
        return null
    }
    
}
