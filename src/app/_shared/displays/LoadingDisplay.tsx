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
                    <div className={`flex gap-2 items-center ${props.className}`}>
                        <Spinner 
                            color="default"
                            classNames = {
                                {
                                    circle1 : "w-5 h-5",
                                    circle2: "w-5 h-5",
                                    wrapper: "w-5 h-5"
                                }
                            }/>
                        <span className="text-sm text-gray-500">
                            {props.message}
                        </span>
                    </div>
                    : null
            }
        </>
    )
}

export default LoadingDisplay
