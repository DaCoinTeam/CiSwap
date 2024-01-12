import { PoolsContext } from "../../_hooks"
import React, { useContext } from "react"
import PoolCard from "./PoolCard"
const PoolsGridView = () => {
    const { poolSummaries } = useContext(PoolsContext)!

    const renderGridView = () : JSX.Element[] => {
        const poolCards : JSX.Element[] = []
        for (const summary of poolSummaries){
            poolCards.push(
                <PoolCard summary={summary} />
            )
        }
        return poolCards
    }
    return (
        <div className="grid md:grid-cols-4 gap-6">
            {renderGridView()}
        </div>
    )
}


export default PoolsGridView
