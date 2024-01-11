export * from "./math"
export * from "./api"
export * from "./format"
export * from "./others"
export * from "./image"
export * from "./array"
export * from "./time"

import array from "./array"
import format from "./format"
import math from "./math"
import time from "./time"

export { format , math, array , time}

const utils = {
    math,
    array,
    format,
    time
}

export default utils
