"use client"
import { ViewOnExplorer } from "@app/_shared"
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
const UserInformation = () => {
    const account = useSelector((state: RootState) => state.blockchain.account)
    return (
        <>
            <div className="text-3xl font-bold"> User </div>
            <ViewOnExplorer hexString={account} showShorten /> 
        </>
    )
}

export default UserInformation