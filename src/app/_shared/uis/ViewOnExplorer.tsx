import React from "react"
import { Link } from "@nextui-org/react"
import { chainInfos } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { shortenAddress } from "@utils"

interface ViewOnExplorerProps {
  className?: string;
  hexString: string;
  isTransaction?: boolean;
  showShorten?: boolean;
}

const ViewOnExplorer = (props: ViewOnExplorerProps) => {
    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )
    const explorerUrl = chainInfos[chainName].explorerUrl
    
    const _middle = props.isTransaction ? "tx" : "address"
    
    const _content = props.showShorten ? shortenAddress(props.hexString) : "View on Explorer"
    return (
        <Link
            href={`${explorerUrl}${_middle}/${props.hexString}`}
            className={`font-bold text-sm ${props.className}`}
            color="foreground"
            showAnchorIcon={!props.showShorten}
        >
            {_content}
        </Link>
    )
}

export default ViewOnExplorer
