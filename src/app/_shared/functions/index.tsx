import { TransactionHash } from "web3"
import { ViewOnExplorer } from "../uis"
import { TitleDisplay } from "../displays"
import { toast } from "react-toastify"
import React from "react"

export const notify = (txHash: TransactionHash) =>
    toast(
        <div>
            <TitleDisplay title="Transaction receipt" />
            <div className="flex gap-1">
                <span className="text-sm">View on explorer:</span>
                <ViewOnExplorer hexString={txHash} isTransaction showShorten />
            </div>
        </div>
    )
