"use client"

import React from "react"
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react"
import { RootState } from "@redux"
import { useSelector } from "react-redux"

export const ConnectedMetamaskSelect = () => {
    const account = useSelector((state: RootState) => state.blockchain.account)

    
    return (<Dropdown>
        <DropdownTrigger>
            <Button 
                variant="bordered" 
            >
                {`${account.slice(0,4)}...${account.slice(-2)}`}
            </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">New file</DropdownItem>
            <DropdownItem key="copy">Copy link</DropdownItem>
            <DropdownItem key="edit">Edit file</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
            Disconnect
            </DropdownItem>
        </DropdownMenu>
    </Dropdown>)
}