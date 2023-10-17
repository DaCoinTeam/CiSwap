import React from "react"

interface ErrorDisplayProps {
    className?: string,
    message?: string
}


const ErrorDisplay = (props : ErrorDisplayProps) => <div className={`text-red-500 text-xs pt-1 px-1 ${props.className}`}> {props.message} </div>

export default ErrorDisplay