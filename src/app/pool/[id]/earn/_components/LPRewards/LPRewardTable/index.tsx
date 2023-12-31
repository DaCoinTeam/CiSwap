"use client"
import React, { useContext, useEffect, useMemo, useState } from "react"
import {
    Pagination,
    Spacer,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react"
import { RewardLog, PoolContract, getRewardLog } from "@blockchain"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { PoolContext } from "../../../../_hooks"
import { ViewOnExplorer } from "@app/_shared"
import { LoadingState } from "@react-types/shared/src/collections"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

interface LPRewardTableProps {
  className?: string;
}

const LPRewardTable = (props: LPRewardTableProps) => {
    const poolContext = useContext(PoolContext)
    if (poolContext === null) return
    const { tokenState, poolAddress } = poolContext 

    const chainId = useSelector(
        (state: RootState) => state.blockchain.chainId
    )

    const account = useSelector((state: RootState) => state.blockchain.account)

    const [awardLogs, setAwardLogs] = useState<RewardLog[]>([])

    useEffect(() => {
        if (!tokenState.finishLoadWithConnected) return

        const handleEffect = async () => {
            const contract = new PoolContract(chainId, poolAddress)
            const events = await contract.getAwardEvents(account)
            if (events === null) return

            const _logs: RewardLog[] = []
            const promises : Promise<number>[] = []
            for (const event of events) {
                if (typeof event === "string") return

                const logPromise = getRewardLog(
                    event,
                    chainId,
                    tokenState.LPTokenDecimals,
                    tokenState.LPTokenSymbol
                ).then(_log => _logs.push(_log))
                
                promises.push(logPromise)
            }

            await Promise.all(promises)
            const _sortedLogs = _logs.sort((prev, next) => next.timestamp.getTime() - prev.timestamp.getTime())
            setAwardLogs(_sortedLogs)

            setLoadingState("idle")
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

    const [loadingState, setLoadingState] = useState<LoadingState>("loading")

    return (
        <>
            <Table
                className={`${props.className} min-h-[222px]`}
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
                <TableBody items={items} 
                    emptyContent={
                        loadingState === "idle" ? "No rows to display." : undefined
                    } 
                    loadingContent={<Spinner color="default" />}
                    loadingState={loadingState}
                >
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
                                {dayjs(item.timestamp).fromNow()}{" "}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {items.length ? 
                (
                    <>
                        <Spacer y={4}/>
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                classNames={
                                    {
                                        cursor: "bg-teal-500"
                                    }
                                }
                                color="secondary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    </>
                ) : null}
        </>
    )
}

export default LPRewardTable
