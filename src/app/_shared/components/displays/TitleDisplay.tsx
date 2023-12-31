import React from "react"

interface TitleDisplayProps {
    className?: string,
    title: string,
    size?: "sm" | "md" | "lg" 
}

const TitleDisplay = (props : TitleDisplayProps) =>
{
    let _size = props.size
    if (!_size) _size = "sm"
    let _textSize : string
    switch (_size){
    case "sm": 
        _textSize = "text-sm"
        break
    case "md": 
        _textSize = "text-base"
        break
    case "lg": 
        _textSize = "text-lg"
        break
    }
    return <div className={`text-teal-500 font-bold ${_textSize} ${props.className}`}> {props.title} </div>
}
export default TitleDisplay