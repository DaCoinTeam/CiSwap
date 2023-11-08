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
import { LiquidityPoolContract } from "@blockchain"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { PoolAddressContext, TokenStateContext } from "@app/pool/[id]/layout"
import { Address } from "web3"
import { calculateRedenomination } from "@utils"
import { ViewOnExplorer } from "@app/_shared"
import { LoadingState } from "@react-types/shared/src/collections"

interface ProviderTableProps {
  className?: string;
}

const ProviderTable = (props: ProviderTableProps) => {
    const poolAddress = useContext(PoolAddressContext)

    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const [providers, setProviders] = useState<Provider[]>([])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return

        const handleEffect = async () => {
            const contract = new LiquidityPoolContract(chainName, poolAddress)
            const addresses = await contract.providerRegisters()
            if (addresses == null) return

            const _providers: Provider[] = []
            
            const promises : Promise<void>[] = []

            for (const address of addresses) {
                const providerPromise = contract.balanceOf(address).then(balance => {
                    if (balance == null) return
                    const _provider = {
                        address,
                        balance: calculateRedenomination(
                            balance,
                            tokenState.LPTokenDecimals,
                            3
                        ),
                    }
                    _providers.push(_provider)
                })
                promises.push(providerPromise)
            }

            await Promise.all(promises)
            
            setProviders(_providers)

            setLoadingState("idle")
        }
        handleEffect()
    }, [tokenState.finishLoadWithoutConnected])

    console.log(providers)

    const [page, setPage] = React.useState(1)
    const rowsPerPage = 6

    const pages = providers.length ? Math.ceil(providers.length / rowsPerPage) : 1

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return providers.slice(start, end)
    }, [page, providers])

    const [loadingState, setLoadingState] = useState<LoadingState>("loading")

    return (
        <>
            <Table 
                className={`${props.className} min-h-[222px]`}
                removeWrapper
                aria-label="Example table with client side pagination"
            >
                <TableHeader>
                    <TableColumn key="address">ADDRESS</TableColumn>
                    <TableColumn key="balance">
                            BALACE
                    </TableColumn>
                </TableHeader>
                <TableBody items={items}  emptyContent={
                    loadingState == "idle" ? "No rows to display." : undefined
                } 
                loadingContent={<Spinner color="default" />}
                loadingState={loadingState}>
                    {(item) => (
                        <TableRow key={item.address}>
                            <TableCell key="address">
                                <ViewOnExplorer hexString={item.address} showShorten />
                            </TableCell>
                            <TableCell key="balance">{item.balance} {tokenState.LPTokenSymbol}</TableCell>
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

export default ProviderTable

interface Provider {
  address: Address;
  balance: number;
}
