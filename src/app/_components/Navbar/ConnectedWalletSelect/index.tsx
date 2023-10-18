"use client"

import React from "react"
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react"
import { AppDispatch, RootState, setWeb3 } from "@redux"
import { useDispatch, useSelector } from "react-redux"
import { shortenAddress } from "@utils"

const ConnectedWalletSelect = () => {
    const account = useSelector((state: RootState) => state.blockchain.account)
    const dispatch: AppDispatch = useDispatch()

    const _disconnect = () => dispatch(setWeb3(null))
    
    return (<Dropdown>
        <DropdownTrigger>
            <Button 
                variant="bordered" 
            >
                {shortenAddress(account)}
            </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">New file</DropdownItem>
            <DropdownItem key="copy">Copy link</DropdownItem>
            <DropdownItem key="edit">Edit file</DropdownItem>
            <DropdownItem onPress={_disconnect} key="delete" className="text-danger" color="danger">
            Disconnect
            </DropdownItem>
        </DropdownMenu>
    </Dropdown>)
}

export default ConnectedWalletSelect