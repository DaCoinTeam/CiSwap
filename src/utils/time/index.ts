import utc from "dayjs/plugin/utc"
import dayjs from "dayjs"
import { computeRound } from "../math/base-math.util"
import { UTCTimestamp } from "lightweight-charts"
dayjs.extend(utc)

const currentSeconds = (): number => computeRound(dayjs().valueOf() / 1000)

const formatMillisecondsAsDate = (milliseconds: number): string => {
    return dayjs(milliseconds).format("YYYY-MM-DD")
}

const secondsToUtc = (seconds: number): UTCTimestamp =>
  computeRound(
      dayjs(seconds * 1000)
          .utc(true)
          .valueOf() / 1000
  ) as UTCTimestamp

const timeUtils = {
    currentSeconds: currentSeconds,
    formatMillisecondsAsDate: formatMillisecondsAsDate,
    secondsToUtc: secondsToUtc,
}

export default timeUtils
