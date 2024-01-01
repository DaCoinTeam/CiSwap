import utc from "dayjs/plugin/utc"
import dayjs from "dayjs"
import { computeRound } from "../math/base-math.util"
dayjs.extend(utc)

const currentMilliseconds = (): number => dayjs().valueOf()

const formatMillisecondsAsDate = (milliseconds: number): string => {
    return dayjs(milliseconds).format("YYYY-MM-DD")
}

const timeToLocal = (originalTime: number) => {
    return computeRound(dayjs(originalTime).utc().valueOf())
}

const timeUtils = {
    currentMilliseconds: currentMilliseconds,
    formatMillisecondsAsDate: formatMillisecondsAsDate,
    timeToLocal: timeToLocal,
}

export default timeUtils