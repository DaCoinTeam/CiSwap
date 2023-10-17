import React from "react"
import { Link } from "@nextui-org/react"
import { chainInfos } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"

interface ViewOnExplorerProps {
  className?: string;
  hexString: string;
  isTransaction?: boolean;
}

const ViewOnExplorer = (props: ViewOnExplorerProps) => {
    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )
    const explorerUrl = chainInfos[chainName].explorerUrl

    const _middle = props.isTransaction ? "tx" : "address"
    return (
        <Link
            href={`${explorerUrl}/${_middle}/${props.hexString}`}
            className={`font-bold text-sm ${props.className}`}
            color="foreground"
            content="View on Explorer"
            showAnchorIcon
        >
            {" "}
      View on Explorer
        </Link>
    )
}

export default ViewOnExplorer
