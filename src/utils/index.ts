export * from "./chart"
export * from "./math"
export * from "./api"
export * from "./format"
export * from "./others"
export * from "./image"
export * from "./array"
export * from "./web3"
export * from "./time"

import arrayUtils from "./array"
import formatUtils from "./format"
import mathUtils from "./math"
import timeUtils from "./time"
import web3Utils from "./web3"

const utils = {
    web3: web3Utils,
    math: mathUtils,
    array: arrayUtils,
    format: formatUtils,
    time: timeUtils
}

export default utils
