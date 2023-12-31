export * from "./server"
export * from "./3rd"
export * from "./next"

import { nextServices } from "./next"

export const services = {
    next: nextServices,
}
