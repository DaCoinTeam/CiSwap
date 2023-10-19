"use client"

import { PoolAddressContext, TokenStateContext } from "@app/pool/[id]/layout"
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

interface ChartProps {
  className?: string;
}

interface RenderLPTokenTick {
  name: string;
  totalSupply: number;
  LPTokenAmountLocked: number;
}

const Chart = (props: ChartProps) => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const poolAddress = useContext(PoolAddressContext)
    
    const chainName = useSelector((state: RootState) => state.blockchain.chainName)

    const [LPTokenTicks, setLPTokenTicks] = useState<RenderLPTokenTick[]>([])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return
        
        const handleEffect = async () => {
            const contract = new LiquidityPoolContract(chainName, poolAddress)
            const _LPTokenTicks = await contract.getAllLPTokenTicks()
            if (_LPTokenTicks == null) return
            const _renderLPTokenTicks : RenderLPTokenTick[] = _LPTokenTicks.map(
                tick => {
                    return {
                        name: new Date(tick.timestamp * 1000).toString(),
                        totalSupply: calculateRedenomination(tick.totalSupply, tokenState.LPTokenDecimals, 3),
                        LPTokenAmountLocked: calculateRedenomination(tick.LPTokenAmountLocked, tokenState.LPTokenDecimals, 3),
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