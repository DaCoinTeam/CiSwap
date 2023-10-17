import React from "react"
import { Overview } from "./_components"

const Page = () => {
    return (
        <div className="grid grid-cols-3 gap-12">
            <Overview clasName = "col-span-1"/>
        </div>
    )
}

export default Page