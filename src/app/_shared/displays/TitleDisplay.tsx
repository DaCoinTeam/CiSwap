import React from "react"

interface TitleDisplayProps {
    className?: string,
    title: string
}


const TitleDisplay = (props : TitleDisplayProps) => <div className="text-teal-500 text-sm font-bold"> {props.title} </div>

export default TitleDisplay