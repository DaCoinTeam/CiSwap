import { ReactNode } from "react"
import { Address } from "web3"

export interface ProvidersProps {
    children: ReactNode
}

export type IdentifierParams = {
    id: Address 
}