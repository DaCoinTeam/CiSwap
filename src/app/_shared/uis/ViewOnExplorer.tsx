import React from "react"
import { Link } from "@nextui-org/react"
import { chains } from "@config"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { shortenAddress } from "@utils"

interface ViewOnExplorerProps {
  className?: string;
  hexString: string;
  isTransaction?: boolean;
  showShorten?: boolean;
  notExternal?: boolean
}

const ViewOnExplorer = (props: ViewOnExplorerProps) => {
    const chainId = useSelector(
        (state: RootState) => state.blockchain.chainId
    )
    const explorerUrl = chains[chainId].explorerUrl
    
    const _external = !props.notExternal
    const _middle = props.isTransaction ? "tx" : "address"
    
    const _content = props.showShorten ? shortenAddress(props.hexString) : "View on Explorer"
    return (
        <Link
            isExternal = {_external}
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
