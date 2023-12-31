import { ERC20Contract, FactoryContract, PoolContract } from "@blockchain"
import { Table, Pagination, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react"
import React, { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { Address } from "web3"

const AllPools = () => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const [page, setPage] = React.useState(1)
    const rowsPerPage = 10

    const [pools, setPools] = useState<PoolInfo[]>([])
      
    const pages = Math.ceil(pools.length / rowsPerPage)

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage
  
        return pools.slice(start, end)
    }, [page, pools])

    useEffect(() => {
        const handleEffect = async () => {
            const contract = new FactoryContract(chainId)
            const pools = await contract.getAll()
            if (pools === null) return
            
            const poolInfos : PoolInfo[] = [] 
            for (const pool of pools){
                const contract = new PoolContract(chainId, pool)
                const token0 = await contract.token0()
                if (token0 === null) return 
                const token0Contract = new ERC20Contract(chainId, token0)
                const token0Symbol =  await token0Contract.symbol()
                if (token0Symbol === null) return

                const token1 = await contract.token1()
                if (token1 === null) return
                const token1Contract = new ERC20Contract(chainId, token1)
                const token1Symbol =  await token1Contract.symbol()
                if (token1Symbol === null) return


                const protocolFee = await contract.protocolFee()
                if (protocolFee === null) return

                const poolInfo: PoolInfo = {
                    address: pool,
                    token0Symbol,
                    token1Symbol,
                    protocolFee,
                    liquidity: 0,
                }

                poolInfos.push(poolInfo)
            }
            setPools(poolInfos)
        }
        handleEffect()
    }, [])

    return (
        <Table 
            aria-label="Example table with client side pagination"
            bottomContent={
                <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="secondary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                </div>
            }
            classNames={{
                wrapper: "min-h-[222px]",
            }}
        >
            <TableHeader>
                <TableColumn key="address">NAME</TableColumn>
                <TableColumn key="role">ROLE</TableColumn>
                <TableColumn key="status">STATUS</TableColumn>
            </TableHeader>
            <TableBody items={items}>
                {(pool) => (
                    <TableRow key={pool.address}>
                        {(columnKey) => <TableCell>{getKeyValue(pool, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default AllPools

interface PoolInfo {
    address: Address,
    token0Symbol: string,
    token1Symbol: string,
    protocolFee: number,
    liquidity: number
}