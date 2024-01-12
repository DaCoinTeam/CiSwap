export * from "./math"
export * from "./api"
export * from "./format"
export * from "./others"
export * from "./image"
export * from "./array"
export * from "./time"
export * from "./storage"

import array from "./array"
import format from "./format"
import math from "./math"
import time from "./time"
import storage from "./storage"

export { format , math, array , time, storage }

const utils = {
    math,
    array,
    format,
    time,
    storage
}

export default utils
