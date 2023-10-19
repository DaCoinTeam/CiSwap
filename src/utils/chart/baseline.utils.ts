import {
    ColorType,
    IChartApi,
    ISeriesApi,
    createChart,
} from "lightweight-charts"

export const DARK_COLOR = "rgb(17 24 28)" as const
export const LIGHT_COLOR = "rgb(236, 237, 238)" as const

export const CHART_LINE_COLOR = "#2962FF"
export const CHART_TEXT_COLOR = "black"
export const CHART_AREA_TOP_COLOR = "#2962FF"
export const CHART_AREA_BOTTOM_COLOR = "rgba(41, 98, 255, 0.28)"
export const CHART_UP_COLOR = "#26a69a"
export const CHART_DOWN_COLOR = "#ef5350"
export const CHART_BORDER_VISIBLE = false
export const CHART_WICK_UP_COLOR = "#26a69a"
export const CHART_WICK_DOWN_COLOR = "#ef5350"

export interface BaselineChartAndSeries {
  chart: IChartApi;
  series: ISeriesApi<"Baseline">;
}

export const getOptions = (container: HTMLDivElement, darkMode: boolean) => {
    return {
        layout: {
            background: { type: ColorType.Solid, color: "transparent" },
            textColor: darkMode ? LIGHT_COLOR : DARK_COLOR,
        },
        rightPriceScale: {
            borderVisible: false,
        },
        width: container.clientWidth,
        height: 300,
        timeScale: {
            timeVisible: true,
            borderVisible: false,
        },
    }
}

export const createBaselineChartAndSeries = (
    container: HTMLDivElement,
    baseValue: number
): BaselineChartAndSeries => {
    const chart = createChart(container)

    const series = chart.addBaselineSeries({
        baseValue: { type: "price", price: baseValue },
        topLineColor: "rgba(20, 184, 166, 1)",
        topFillColor1: "rgba(20, 184, 166, 0.28)",
        topFillColor2: "rgba(20, 184, 166, 0.05)",
        bottomLineColor: "rgba(239, 68, 68, 1)",
        bottomFillColor1: "rgba(239, 68, 68, 0.05)",
        bottomFillColor2: "rgba(239, 68, 68, 0.28)",
    })
    
    chart.timeScale().fitContent()

    return {
        chart,
        series,
    }
}

export const updateBaselineChartWithOptions = (
    chart: IChartApi,
    container: HTMLDivElement,
    darkMode: boolean
) => chart.applyOptions(getOptions(container, darkMode))
