"use client"

import  { PoolContext } from "../../../_hooks"
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

interface ChartProps {
  className?: string;
}

interface RenderLPTokenTick {
  name: string;
  totalSupply: number;
  LPTokenAmountLocked: number;
}

const Chart = (props: ChartProps) => {
    const poolContext = useContext(PoolContext)
    if (poolContext == null) return
    const { tokenState, poolAddress } = poolContext
    
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const [LPTokenTicks, setLPTokenTicks] = useState<RenderLPTokenTick[]>([])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return
        
        const handleEffect = async () => {
            const contract = new PoolContract(chainId, poolAddress)
            const _LPTokenTicks = await contract.getAllLPTokenTicks()
            if (_LPTokenTicks == null) return
            const _renderLPTokenTicks : RenderLPTokenTick[] = _LPTokenTicks.map(
                tick => {
                    return {
                        name: new Date(tick.timestamp * 1000).toString(),
                        totalSupply: computeRedenomination(tick.totalSupply, tokenState.LPTokenDecimals, 3),
                        LPTokenAmountLocked: computeRedenomination(tick.LPTokenAmountLocked, tokenState.LPTokenDecimals, 3),
                    }
                }
            )

            console.log(_LPTokenTicks)
            setLPTokenTicks(_renderLPTokenTicks)
        }
        
        handleEffect()
    }, [tokenState.finishLoadWithoutConnected])
    
    return (
        <ResponsiveContainer className={`${props.className}`}>
            <AreaChart
                data={LPTokenTicks}
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

export default Chart