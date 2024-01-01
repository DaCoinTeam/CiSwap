import {
    BaselineData,
    ColorType,
    DeepPartial,
    IChartApi,
    ISeriesApi,
    MouseEventHandler,
    TickMarkFormatter,
    Time,
    TimeChartOptions,
    createChart,
} from "lightweight-charts"
import { AggregatorContract } from "@blockchain"
import { ChainId, chainInfos } from "@config"
import { Bytes } from "web3"
import utils from "@utils"
import { Period } from "./common"

const TOP_LINE_COLOR = "rgba(20, 184, 166, 1)"
const TOP_FILL_COLOR1 = "rgba(20, 184, 166, 0.28)"
const TOP_FILL_COLOR2 = "rgba(20, 184, 166, 0.05)"
const BOTTOM_LINE_COLOR = "rgba(239, 68, 68, 1)"
const BOTTOM_FILL_COLOR1 = "rgba(239, 68, 68, 0.05)"
const BOTTOM_FILL_COLOR2 = "rgba(239, 68, 68, 0.28)"

export const DARK_COLOR = "rgb(17 24 28)"
export const LIGHT_COLOR = "rgb(236, 237, 238)"

export const CHART_LINE_COLOR = "#2962FF"
class PriceChart {
    chainId: ChainId
    private aggregatorContract: AggregatorContract

    private defaultPrice: number
    private period: Period
    private path: Bytes
    private darkMode: boolean

    private container: HTMLDivElement
    chart: IChartApi
    series: ISeriesApi<"Baseline">

    constructor(
        chainId: ChainId,
        container: HTMLDivElement,
        darkMode: boolean,
        period: Period,
        onCrosshairMove?: MouseEventHandler<Time>,
        defaultPrice?: number
    ) {
        this.chainId = chainId

        this.aggregatorContract = new AggregatorContract(
            this.chainId,
            chainInfos[this.chainId].aggregator
        )

        this.defaultPrice = defaultPrice ?? 0

        this.darkMode = darkMode
        this.period = period
        this.path = "0x"
        this.container = container

        this.chart = createChart(container)

        if (onCrosshairMove) {
            this.chart.subscribeCrosshairMove(onCrosshairMove)
        }

        this.series = this.chart.addBaselineSeries({
            baseValue: { type: "price", price: defaultPrice },
            topLineColor: TOP_LINE_COLOR,
            topFillColor1: TOP_FILL_COLOR1,
            topFillColor2: TOP_FILL_COLOR2,
            bottomLineColor: BOTTOM_LINE_COLOR,
            bottomFillColor1: BOTTOM_FILL_COLOR1,
            bottomFillColor2: BOTTOM_FILL_COLOR2,
        })

        this.applyOptions()
    }

    updateDarkMode(darkMode: boolean) {
        this.darkMode = darkMode
        this.applyOptions()
    }

    async updatePeriod(period: Period) {
        this.period = period
        await this.setData()
    }

    async updatePath(path: Bytes) {
        this.path = path
        await this.setData()
    }

    private applyOptions() {
        const formatTickMark: TickMarkFormatter = (time): string => {
            const timeInNumber = Number(time.toString())
            const periodToReturn: Record<Period, string> = {
                [Period._24H]: utils.time.getHoursFromUtcSeconds(timeInNumber),
                [Period._1W]: utils.time.getHoursFromUtcSeconds(timeInNumber),
                [Period._1M]: utils.time.getHoursFromUtcSeconds(timeInNumber),
                [Period._1Y]: utils.time.getHoursFromUtcSeconds(timeInNumber),
            }
            return periodToReturn[this.period]
        }

        const options: DeepPartial<TimeChartOptions> = {
            layout: {
                background: { type: ColorType.Solid, color: "transparent" },
                textColor: this.darkMode ? LIGHT_COLOR : DARK_COLOR,
            },
            rightPriceScale: {
                borderVisible: false,
            },
            width: this.container.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                borderVisible: false,
                tickMarkFormatter: formatTickMark,
            },
            handleScroll: false,
            handleScale: false,
            crosshair: {
                vertLine: {
                    labelVisible: false,
                },
            },
        }

        this.chart.applyOptions(options)
        this.chart.timeScale().fitContent()
    }

    private async setData() {
        const periodToSnapshotOptions: Record<Period, SnapshotOptions> = {
            [Period._24H]: {
                secondOffset: 60,
                numberOfSnapshots: 24,
            },
            [Period._1W]: {
                secondOffset: 60 * 60 * 4,
                numberOfSnapshots: 7 * 6,
            },
            [Period._1M]: {
                secondOffset: 60 * 60 * 24,
                numberOfSnapshots: 30,
            },
            [Period._1Y]: {
                secondOffset: 60 * 60 * 24 * 15,
                numberOfSnapshots: 24,
            },
        }
        const { numberOfSnapshots, secondOffset } =
      periodToSnapshotOptions[this.period]

        const targets: number[] = []
        for (let i = 0; i < numberOfSnapshots; i++) {
            targets.push(utils.time.currentSeconds() - secondOffset * i)
        }

        const priceX96s = await this.aggregatorContract.aggregatePriceX96(
            BigInt(secondOffset),
            numberOfSnapshots,
            this.path
        )
        console.log(this.path)

        if (priceX96s === null) return null

        const prices = priceX96s.map((priceX96) =>
            utils.math.computeDivideX96(priceX96)
        )
        const data: BaselineData<Time>[] = []

        for (let i = 0; i < numberOfSnapshots; i++) {
            data.push({
                time: utils.time.secondsToUtc(targets[i]),
                value: prices[i],
            })
        }
        data.reverse()

        this.series.setData(data)
        this.chart.timeScale().fitContent()
    }
}

export default PriceChart

interface SnapshotOptions {
  secondOffset: number;
  numberOfSnapshots: number;
}
