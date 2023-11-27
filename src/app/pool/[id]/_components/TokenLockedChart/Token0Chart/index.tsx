"use client"

import { PoolContext } from "../../../layout"
import React, { useContext, useEffect, useState } from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts"
import { LiquidityPoolContract } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { calculateRedenomination } from "@utils"

interface Token0ChartProps {
  className?: string;
}

interface RenderToken0Tick {
  name: string;
  token0AmountLocked: number;
}

const Token0Chart = (props: Token0ChartProps) => {
    const context = useContext(PoolContext)
    if (context == null) return
    const { tokenState, poolAddress } = context
    
    const chainName = useSelector((state: RootState) => state.blockchain.chainName)

    const [token0Ticks, setToken0Ticks] = useState<RenderToken0Tick[]>([])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return
        
        const handleEffect = async () => {
            const contract = new LiquidityPoolContract(chainName, poolAddress)
            const _baseTicks = await contract.getAllBaseTicks()
            if (_baseTicks == null) return
            const _renderToken0Ticks : RenderToken0Tick[] = _baseTicks.map(
                tick => {
                    return {
                        name: new Date(tick.timestamp * 1000).toString(),
                        token0AmountLocked: calculateRedenomination(tick.token0AmountLocked, tokenState.token0Decimals, 3)
                    }
                }
            )
            setToken0Ticks(_renderToken0Ticks)
        }
        
        handleEffect()
    }, [tokenState.finishLoadWithoutConnected])
    
    return (
        <ResponsiveContainer className={`${props.className}`}>
            <AreaChart
                data={token0Ticks}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >   
                <XAxis dataKey="name" />
                <YAxis />
                <Legend />
                <Tooltip />
                <Area
                    type="monotone"
                    name={`${tokenState.token0Symbol} Locked`}
                    dataKey="token0AmountLocked"
                    stroke="#ec4899"
                    fill="#fbcfe8"
                    fillOpacity={1}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default Token0Chart