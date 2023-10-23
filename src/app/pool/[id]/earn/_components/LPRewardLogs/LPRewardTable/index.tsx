"use client"
import React, { useContext, useEffect, useMemo, useState } from "react"
import {
    Pagination,
    Spacer,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react"
import { RewardLog, LiquidityPoolContract, getRewardLog } from "@blockchain"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { PoolAddressContext, TokenStateContext } from "@app/pool/[id]/layout"
import { ViewOnExplorer } from "@app/_shared"
import { calculateTimeAgo } from "@utils"

interface LPRewardTableProps {
  className?: string;
}

const LPRewardTable = (props: LPRewardTableProps) => {
    const poolAddress = useContext(PoolAddressContext)

    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const account = useSelector((state: RootState) => state.blockchain.account)

    const [awardLogs, setAwardLogs] = useState<RewardLog[]>([])

    useEffect(() => {
        if (!tokenState.finishLoadWithConnected) return

        const handleEffect = async () => {
            const contract = new LiquidityPoolContract(chainName, poolAddress)
            const events = await contract.getAwardEvents(account)
            if (events == null) return

            const _logs: RewardLog[] = []
            for (const event of events) {
                if (typeof event == "string") return

                const _log = await getRewardLog(
                    event,
                    chainName,
                    tokenState.LPTokenDecimals,
                    tokenState.LPTokenSymbol
                )
                _logs.push(_log)
            }

            setAwardLogs(_logs)
        }
        handleEffect()
    }, [tokenState.finishLoadWithConnected])

    const [page, setPage] = React.useState(1)
    const rowsPerPage = 10

    const pages = awardLogs.length
        ? Math.ceil(awardLogs.length / rowsPerPage)
        : 1

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return awardLogs.slice(start, end)
    }, [page, awardLogs])

    return (
        <>
            <Table
                className={`${props.className}`}
                removeWrapper
                aria-label="Example table with client side pagination"
            >
                <TableHeader>
                    <TableColumn key="transactionHash">
            TX HASH
                    </TableColumn>
                    <TableColumn key="LPTokenReward">
            LP TOKEN REWARD
                    </TableColumn>
                    <TableColumn key="time">
            TIME
                    </TableColumn>
                </TableHeader>
                <TableBody items={items} emptyContent={"No rows to display."}>
                    {(item) => (
                        <TableRow key={item.transactionHash}>
                            <TableCell key="transactionHash">
                                <ViewOnExplorer
                                    hexString={item.transactionHash}
                                    showShorten
                                    isTransaction
                                />
                            </TableCell>
                            <TableCell key="LPTokenReward">
                                <span className="text-teal-500 gap-1 flex items-center">
                                    {item.LPTokenAward}
                                </span>
                            </TableCell>
                            <TableCell key="time">
                                {" "}
                                {calculateTimeAgo(item.timestamp)}{" "}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Spacer y={4}/>
            <div className="flex w-full justify-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    classNames={{
                        cursor: "bg-teal-500",
                    }}
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                />
            </div>
        </>
    )
}

export default LPRewardTable
