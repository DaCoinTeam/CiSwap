import {
    BaselineData,
    BaselineStyleOptions,
    ChartOptions,
    ColorType,
    DeepPartial,
    IChartApi,
    ISeriesApi,
    MouseEventHandler,
    PriceFormatterFn,
    SeriesOptionsCommon,
    TickMarkFormatter,
    Time,
    createChart,
} from "lightweight-charts"
import { AggregatorContract } from "@blockchain"
import { ChainId, chainInfos } from "@config"
import { Bytes } from "web3"
import { math, time } from "@utils"
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

    private period: Period
    private darkMode: boolean
    private path: Bytes = "0x"
    private container: HTMLDivElement
    chart: IChartApi
    series: ISeriesApi<"Baseline"> | null = null

    constructor(
        chainId: ChainId,
        container: HTMLDivElement,
        darkMode: boolean,
        period: Period,
        onCrosshairMove?: MouseEventHandler<Time>
    ) {
        this.chainId = chainId

        this.aggregatorContract = new AggregatorContract(
            this.chainId,
            chainInfos[this.chainId].aggregator
        )

        this.darkMode = darkMode
        this.period = period

        this.container = container

        this.chart = createChart(container)
        this.series = this.chart.addBaselineSeries()

        if (onCrosshairMove) {
            this.chart.subscribeCrosshairMove(onCrosshairMove)
        }
    }

    updateDarkMode(darkMode: boolean) {
        this.darkMode = darkMode
        this.applyOptionsToChart()
    }

    async updatePeriod(period: Period): Promise<TicksBoundary | null> {
        this.period = period
        return await this.setData()
    }

    async updatePath(path: Bytes): Promise<TicksBoundary | null> {
        this.path = path
        return await this.setData()
    }

    applyOptionsToChart() {
        const formatTickMark: TickMarkFormatter = (timeTick): string => {
            const timeInNumber = Number(timeTick.toString())
            const periodToReturn: Record<Period, string> = {
                [Period._24H]: time.getHoursFromUtcSeconds(timeInNumber),
                [Period._1W]: time.getHoursFromUtcSeconds(timeInNumber),
                [Period._1M]: time.getHoursFromUtcSeconds(timeInNumber),
                [Period._1Y]: time.getHoursFromUtcSeconds(timeInNumber),
            }
            return periodToReturn[this.period]
        }

        const formatPrice: PriceFormatterFn = (p) => p.toFixed(5)

        const options: DeepPartial<ChartOptions> = {
            layout: {
                background: { type: ColorType.Solid, color: "transparent" },
                textColor: this.darkMode ? LIGHT_COLOR : DARK_COLOR,
            },
            rightPriceScale: {
                borderVisible: false,
            },
            localization: {
                priceFormatter: formatPrice,
            },
            width: this.container.clientWidth,
            height: this.container.clientHeight,
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

    applyOptionsToSeries(price: number) {
        const options: DeepPartial<BaselineStyleOptions & SeriesOptionsCommon> = {
            baseValue: { type: "price", price },
            topLineColor: TOP_LINE_COLOR,
            topFillColor1: TOP_FILL_COLOR1,
            topFillColor2: TOP_FILL_COLOR2,
            bottomLineColor: BOTTOM_LINE_COLOR,
            bottomFillColor1: BOTTOM_FILL_COLOR1,
            bottomFillColor2: BOTTOM_FILL_COLOR2,
        }
        this.series?.applyOptions(options)
    }

    private async getData(): Promise<BaselineData<Time>[] | null> {
        const periodToSnapshotOptions: Record<Period, SnapshotOptions> = {
            [Period._24H]: {
                secondOffset: 60 * 60,
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
            targets.push(time.currentSeconds() - secondOffset * i)
        }

        const priceX96s = await this.aggregatorContract.aggregatePriceX96(
            BigInt(secondOffset),
            numberOfSnapshots,
            this.path
        )
        
        if (priceX96s === null) return null

        const prices = priceX96s.map((priceX96) =>
            math.blockchain.computeDivideX96(priceX96)
        )
        const data: BaselineData<Time>[] = []

        for (let i = 0; i < numberOfSnapshots; i++) {
            data.push({
                time: time.secondsToUtc(targets[i]),
                value: prices[i],
            })
        }
        data.reverse()

        return data
    }

    async setData(
        data: BaselineData<Time>[] | null = null
    ): Promise<TicksBoundary | null> {
        if (!data) {
            data = await this.getData()
        }
        if (!data) return null

        if (this.series === null) return null

        this.series.setData(data)
        this.chart.timeScale().fitContent()

        const first = data[0]
        if (!first) return null

        const last = data.at(-1)
        if (!last) return null

        return {
            first,
            last,
        }
    }
}

export default PriceChart

interface SnapshotOptions {
  secondOffset: number;
  numberOfSnapshots: number;
}

export interface TicksBoundary {
  first: BaselineData<Time>;
  last: BaselineData<Time>;
}
