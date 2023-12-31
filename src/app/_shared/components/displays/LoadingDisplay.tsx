import { Spinner } from "@nextui-org/react"
import React from "react"

interface LoadingDisplayProps {
    className?: string,
    finishLoad?: boolean,
    message: string
}


const LoadingDisplay = (props : LoadingDisplayProps) => {
    return (
        <>
            {
                !props.finishLoad
                    ? 
                    <div className={`flex gap-2 items-center pt-1 px-1 ${props.className}`}>
                        <Spinner 
                            color="default"
                            classNames = {
                                {
                                    circle1 : "w-4 h-4",
                                    circle2: "w-4 h-4",
                                    wrapper: "w-4 h-4"
                                }
                            }/>
                        <span className="text-xs text-gray-500">
                            {props.message}
                        </span>
                    </div>
                    : null
            }
        </>
    )
}

export default LoadingDisplay
