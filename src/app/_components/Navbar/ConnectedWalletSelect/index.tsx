"use client"

import React, { useContext } from "react"
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react"
import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { MetamaskContext } from "@app/_hooks"
import { format } from "@utils"

const ConnectedWalletSelect = () => {
    const account = useSelector((state: RootState) => state.blockchain.account)
    const { web3State } = useContext(MetamaskContext)!
    const { setWeb3 } = web3State

    const router = useRouter()

    const menu = [
        {
            key: "profile",
            text: "Profile",
            handleOnPress: () => router.push("/profile"),
            isDanger: false,
        },
        {
            key: "disconnect",
            text: "Disconnect",
            handleOnPress: () => setWeb3(null),
            isDanger: true,
        },
    ]

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="bordered">{format.shortenAddress(account)}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
                {menu.map((item) => (
                    <DropdownItem
                        className={item.isDanger ? "text-danger" : undefined}
                        color={item.isDanger ? "danger" : undefined}
                        onPress={item.handleOnPress}
                        key={item.key}
                    >
                        {item.text}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    )
}

export default ConnectedWalletSelect
