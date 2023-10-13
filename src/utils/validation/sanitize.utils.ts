export const sanitizeNumericInput = (input: string): string | null => {
    const regex = /^[0-9]*[.,]?[0-9]*$/
    
    if (!regex.test(input)) {
        return null 
    }
    
    const sanitizedValue = input.replace(/,/g, ".") 

    return sanitizedValue 
}