export * from "./chart"
export * from "./math"
export * from "./api"
export * from "./format"
export * from "./others"
export * from "./image"
export * from "./array"
export * from "./web3"

import arrayUtils from "./array"
import formatUtils from "./format"
import mathUtils from "./math"
import web3Utils from "./web3"

const utils = {
    web3: web3Utils,
    math: mathUtils,
    array: arrayUtils,
    format: formatUtils
}

export default utils
