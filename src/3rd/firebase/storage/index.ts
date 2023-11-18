import { storage } from "@3rd"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

export const uploadImage = async (file: File) : Promise<string> => {
    const storageRef = ref(storage, `images/${file.name}`)

    try {
        const metadata = {
            contentType: "image/png",
        }
        await uploadBytes(storageRef, file, metadata)    
        const downloadUrl = await getDownloadURL(storageRef)
        return downloadUrl
        
    } catch (error) {
        console.error("Error uploading file: ", error)
        throw error
    }
}