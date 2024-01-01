import utc from "dayjs/plugin/utc"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import dayjs from "dayjs"
import { computeRound } from "../math/base-math.util"
import { UTCTimestamp } from "lightweight-charts"
dayjs.extend(utc)
dayjs.extend(LocalizedFormat)

const currentSeconds = (): number => computeRound(dayjs().valueOf() / 1000)

const getHoursFromUtcSeconds = (seconds: number): string => {
    return dayjs(seconds * 1000).utc().format("LT")
}

const secondsToUtc = (seconds: number): UTCTimestamp =>
  computeRound(
      dayjs(seconds * 1000)
          .utc(true)
          .valueOf() / 1000
  ) as UTCTimestamp

const timeUtils = {
    currentSeconds: currentSeconds,
    getHoursFromUtcSeconds: getHoursFromUtcSeconds,
    secondsToUtc: secondsToUtc,
}

export default timeUtils
