"use client"
import {
    Pagination,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Table,
    Spinner,
    Chip,
} from "@nextui-org/react"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { ViewOnExplorer } from "@app/_shared"
import { PoolContext } from "../../../layout"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { LiquidityPoolContract, RenderTransaction, TransactionMethod, getTransaction } from "@blockchain"
import { LoadingState } from "@react-types/shared/src/collections"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

interface TransactionTableProps {
  className?: string;
}

const TransactionTable = (props: TransactionTableProps) => {
    const context = useContext(PoolContext)
    if (context == null) return 
    const { tokenState, poolAddress } = context

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const [transactions, setTransactions] = useState<RenderTransaction[]>([])
    const [numPages, setNumPages] = useState(0)

    const [page, setPage] = React.useState(1)
    const rowsPerPage = 10

    const [loadingState, setLoadingState] = useState<LoadingState>("loading")

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return
        setLoadingState("loading")
        const handleEffect = async () => {
            const _transactions: RenderTransaction[] = []

            const contract = new LiquidityPoolContract(chainName, poolAddress)

            const txHashs = await contract.getTransactionHashs()

            if (txHashs == null) return

            setNumPages(txHashs.length)

            const promises: Promise<number>[] = []
            for (
                let i = rowsPerPage * (page - 1);
                i < Math.min(rowsPerPage * page, txHashs.length);
                i++
            ) {
                const txHash = txHashs[i]

                const transactionPromise = getTransaction(
                    txHash, 
                    chainName,  
                    tokenState.token0Symbol,
                    tokenState.token1Symbol,
                    tokenState.LPTokenSymbol,
                    tokenState.token0Decimals,
                    tokenState.token1Decimals,
                    tokenState.LPTokenDecimals
                ).then(_transaction => _transactions.push(_transaction))

                promises.push(transactionPromise)
            }
            await Promise.all(promises)
            _transactions.sort((prev, next) => next.timestamp.getTime() - prev.timestamp.getTime())

            setTransactions(_transactions)

            setLoadingState("idle")
        }

        handleEffect()
    }, [page, tokenState.finishLoadWithoutConnected])

    const pages = useMemo(() => {
        return numPages ? Math.ceil(numPages / rowsPerPage) : 1
    }, [numPages, rowsPerPage])

    console.log(transactions)

    return (
        <Table
            className={`min-h-[222px] ${props.className}`}
            removeWrapper
            aria-label="Example table with client side pagination"
            bottomContent={
                transactions.length ? (
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            isDisabled={loadingState == "loading"}
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                            classNames={
                                {
                                    cursor: "bg-teal-500"
                                }
                            }
                        />
                    </div>
                ) : null
            }
        >
            <TableHeader>
                <TableColumn key="transactionHash">
          TX HASH
                </TableColumn>
                <TableColumn key="method">
          METHOD
                </TableColumn>
                <TableColumn key="tokenIn">
          TOKEN IN
                </TableColumn>
                <TableColumn key="tokenOut">
          TOKEN OUT
                </TableColumn>
                <TableColumn key="account">
          ACCOUNT
                </TableColumn>
                <TableColumn key="time">
          TIME
                </TableColumn>
            </TableHeader>
            <TableBody
                items={transactions}
                emptyContent={
                    loadingState == "idle" ? "No rows to display." : undefined
                }
                loadingContent={<Spinner color="default" />}
                loadingState={loadingState}
            >
                {(transaction) => (
                    <TableRow key={transaction.transactionHash}>
                        <TableCell key="transactionHash">
                            <ViewOnExplorer
                                hexString={transaction.transactionHash}
                                isTransaction
                                showShorten
                            />
                        </TableCell>
                        <TableCell key="method"> {renderMethod(transaction.method)} </TableCell>
                        <TableCell key="tokenIn"> {transaction.tokenIn} </TableCell>
                        <TableCell key="tokenOut"> {transaction.tokenOut}</TableCell>
                        <TableCell key="account">
                            {" "}
                            <ViewOnExplorer
                                hexString={transaction.account}
                                isTransaction
                                showShorten
                            />
                        </TableCell>
                        <TableCell key="time">
                            {dayjs(transaction.timestamp).fromNow()}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default TransactionTable

export const renderMethod = (method: TransactionMethod) => {
    let color: "warning" | "success" | "secondary" | "primary" | "default"
    switch (method) {
    case TransactionMethod.RegisterProvider:
        color = "warning"
        break
    case TransactionMethod.Swap:
        color = "success"
        break
    case TransactionMethod.Deposit:
        color = "secondary"
        break
    case TransactionMethod.Withdraw:
        color = "primary"
        break
    default:
        color = "default"
        break
    }
    return <Chip color={color} variant="flat">{method}</Chip>
}

