import {
    BaselineData,
    ColorType,
    IChartApi,
    ISeriesApi,
    Time,
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

export const DARK_COLOR = "rgb(17 24 28)" as const
export const LIGHT_COLOR = "rgb(236, 237, 238)" as const

export const CHART_LINE_COLOR = "#2962FF"
export const CHART_TEXT_COLOR = "black"

class PriceChart {
    chainId: ChainId
    private defaultPrice: number
    private container: HTMLDivElement
    private aggregatorContract: AggregatorContract
    chart: IChartApi
    series: ISeriesApi<"Baseline">

    constructor(
        chainId: ChainId,
        container: HTMLDivElement,
        defaultPrice?: number,
        darkMode?: boolean
    ) {
        this.chainId = chainId
        this.defaultPrice = defaultPrice ?? 0
        this.container = container
        this.aggregatorContract = new AggregatorContract(
            this.chainId,
            chainInfos[this.chainId].aggregator
        )

        this.chart = createChart(container)
        this.series = this.chart.addBaselineSeries({
            baseValue: { type: "price", price: defaultPrice },
            topLineColor: TOP_LINE_COLOR,
            topFillColor1: TOP_FILL_COLOR1,
            topFillColor2: TOP_FILL_COLOR2,
            bottomLineColor: BOTTOM_LINE_COLOR,
            bottomFillColor1: BOTTOM_FILL_COLOR1,
            bottomFillColor2: BOTTOM_FILL_COLOR2,
        })

        this.chart.timeScale().fitContent()

        this.updateChartOptionsForDarkMode(darkMode)
    }

    private getOptions(darkMode?: boolean) {
        return {
            layout: {
                background: { type: ColorType.Solid, color: "transparent" },
                textColor: darkMode ? LIGHT_COLOR : DARK_COLOR,
            },
            rightPriceScale: {
                borderVisible: false,
            },
            width: this.container.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                borderVisible: false,
            },
        }
    }

    updateChartOptionsForDarkMode(darkMode?: boolean) {
        this.chart.applyOptions(this.getOptions(darkMode))
    }

    async updateTicks(period: Period, path: Bytes) {
        const periodToSnapshotOptions: Record<Period, SnapshotOptions> = {
            [Period._24H]: {
                secondOffset: 1,
                numberOfSnapshots: 12,
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
        const { numberOfSnapshots, secondOffset } = periodToSnapshotOptions[period]

        const targets: number[] = []
        for (let i = 0; i < numberOfSnapshots; i++) {
            targets.push(utils.time.currentMilliseconds() - secondOffset * i)
        }
        console.log(path)
        const priceX96s = await this.aggregatorContract.aggregatePriceX96(
            BigInt(secondOffset),
            numberOfSnapshots,
            path
        )
        console.log(priceX96s)
        if (priceX96s === null) return null

        const prices = priceX96s.map((priceX96) =>
            utils.math.computeDivideX96(priceX96)
        )
        const data: BaselineData<Time>[] = []

        for (let i = 0; i < numberOfSnapshots; i++) {
            data.push({
                time: utils.time.formatMillisecondsAsDate(targets[i]),
                value: prices[i],
            })
        }
        data.reverse()
        console.log(data)

        this.series.setData(data)
    }

    render(): HTMLDivElement {
        return this.container
    }
}

export default PriceChart

interface SnapshotOptions {
  secondOffset: number;
  numberOfSnapshots: number;
}
