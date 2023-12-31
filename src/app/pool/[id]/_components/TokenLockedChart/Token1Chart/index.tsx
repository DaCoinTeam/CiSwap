"use client"

import { PoolContext  } from "../../../_hooks"
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
import { PoolContract } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { computeRedenomination } from "@utils"

interface Token1ChartProps {
  className?: string;
}

interface RenderToken1Tick {
  name: string;
  token1AmountLocked: number;
}

const Token1Chart = (props: Token1ChartProps) => {
    const poolContext = useContext(PoolContext)
    if (poolContext === null) return 
    const { tokenState, poolAddress } = poolContext 
    
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const [token1Ticks, setToken1Ticks] = useState<RenderToken1Tick[]>([])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return
        
        const handleEffect = async () => {
            const contract = new PoolContract(chainId, poolAddress)
            const _baseTicks = await contract.getAllBaseTicks()
            if (_baseTicks === null) return
            const _renderToken1Ticks : RenderToken1Tick[] = _baseTicks.map(
                tick => {
                    return {
                        name: new Date(tick.timestamp * 1000).toString(),
                        token1AmountLocked: computeRedenomination(tick.token0AmountLocked, tokenState.token0Decimals, 3)
                    }
                }
            )
            setToken1Ticks(_renderToken1Ticks)
        }
        
        handleEffect()
    }, [tokenState.finishLoadWithoutConnected])
    
    return (
        <ResponsiveContainer className={`${props.className}`}>
            <AreaChart
                data={token1Ticks}
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
                    name="LP Token Supply"
                    dataKey="totalSupply"
                    stroke="#ec4899"
                    fill="#fbcfe8"
                    fillOpacity={1}
                />
                <Area
                    type="monotone"
                    name="LP Token Locked"
                    dataKey="LPTokenAmountLocked"
                    stroke="#0ea5e9"
                    fill="#bae6fd"
                    fillOpacity={1}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default Token1Chart