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
} from "@nextui-org/react"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { ViewOnExplorer } from "@app/_shared"
import { PoolAddressContext, TokenStateContext } from "@app/pool/[id]/layout"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { LiquidityPoolContract, RenderTransaction, getTransaction } from "@blockchain"
import { LoadingState } from "@react-types/shared/src/collections"

interface TransactionTableProps {
  className?: string;
}

const TransactionTable = (props: TransactionTableProps) => {
    const poolAddress = useContext(PoolAddressContext)

    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

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

            for (
                let i = rowsPerPage * (page - 1);
                i < Math.min(rowsPerPage * page, txHashs.length);
                i++
            ) {
                const txHash = txHashs[i]

                const _transaction = await getTransaction(
                    txHash, 
                    chainName,  
                    tokenState.token0Symbol,
                    tokenState.token1Symbol,
                    tokenState.LPTokenSymbol,
                    tokenState.token0Decimals,
                    tokenState.token1Decimals,
                    tokenState.LPTokenDecimals
                )

                _transactions.push(_transaction)
            }

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
                <TableColumn key="transactionHash" width={"15%"}>
          Tx Hash
                </TableColumn>
                <TableColumn key="method" width={"15%"}>
          Method
                </TableColumn>
                <TableColumn key="tokenIn" width={"15%"}>
          Token In
                </TableColumn>
                <TableColumn key="tokenOut" width={"15%"}>
          Token Out
                </TableColumn>
                <TableColumn key="account" width={"15%"}>
          Account
                </TableColumn>
                <TableColumn key="time" width={"25%"}>
          Time
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
                        <TableCell key="method"> {transaction.method} </TableCell>
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
                            {transaction.timestamp.toLocaleString()}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default TransactionTable

