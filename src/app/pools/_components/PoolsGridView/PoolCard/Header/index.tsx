"use client"
import { Avatar, CardHeader, Chip } from "@nextui-org/react"
import React, { useContext } from "react"
import { PoolCardContext } from "../index"

interface HeaderProps {}

const Header = (props: HeaderProps) => {
    const { symbol0, symbol1, indexPool } = useContext(PoolCardContext)!
    return (
        <CardHeader className="p-5">
            <div className="flex justify-between w-full">
                <div className="w-fit">
                    <div className="flex flex-row-reverse relative items-center">
                        <Avatar
                            isBordered
                            size="sm"
                            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                        />
                        <Avatar
                            isBordered
                            size="lg"
                            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                        />
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="text-2xl font-bold"> {`${symbol0}/${symbol1}`} </div>
                    <Chip color="primary" variant="flat">
    #{indexPool}
                    </Chip>
                </div>
            </div>
        </CardHeader>
    )
}

export default Header
