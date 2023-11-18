export const createBlobUrlFromImageFile = (imageFile: File): string | null => {
    try {
        const blob = new Blob([imageFile], { type: imageFile.type })
        const blobUrl = URL.createObjectURL(blob)
        return blobUrl
    } catch (error) {
        console.error(error)
        return null
    }
}