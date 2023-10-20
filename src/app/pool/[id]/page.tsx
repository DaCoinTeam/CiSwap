import React from "react"
import { Overview, TokenLockedChart } from "./_components"

const Page = () => {
    return (
        <div className="flex grid grid-cols-3 gap-12">
            <Overview clasName = "col-span-1 flex-none"/>
            <TokenLockedChart className = "col-span-2"/>
        </div>
    )
}

export default Page