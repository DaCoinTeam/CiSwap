"use client"

import React from "react"
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react"
import { AppDispatch, RootState, setWeb3 } from "@redux"
import { useDispatch, useSelector } from "react-redux"
import { shortenAddress } from "@utils"
import { useRouter } from "next/navigation"

const ConnectedWalletSelect = () => {
    const account = useSelector((state: RootState) => state.blockchain.account)
    const dispatch: AppDispatch = useDispatch()

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
            handleOnPress: () => dispatch(setWeb3(null)),
            isDanger: true,
        },
    ]

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="bordered">{shortenAddress(account)}</Button>
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
