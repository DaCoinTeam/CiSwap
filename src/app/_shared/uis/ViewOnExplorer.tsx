
import React from "react"
import { Link } from "@nextui-org/react"

interface ViewOnExplorerProps {
    className?: string,
    hexString: string,
    isTransaction?: boolean,
}

const ViewOnExplorer = (props: ViewOnExplorerProps) => {
    return (
        <Link href={`${props.hexString}`} className="font-bold text-sm" color="foreground" content="View on Explorer" showAnchorIcon> View on Explorer</Link>
    )
}

export default ViewOnExplorer