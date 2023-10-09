
import React from "react"
import { Button } from "@nextui-org/react"

interface AppButtonProps {
    className?: string,
    darkMode? : boolean,
    size?: "sm" | "md" | "lg",
    onPress?: () => void,
    content: string

}

const AppButton = (props: AppButtonProps) => {
    const _size = props.size ?? "md"
    return (
        <Button
            size={_size}
            className={`bg-teal-500 font-bold ${
                props.darkMode ? "text-black" : "text-white"
            } ${props.className}`}
            onPress={props.onPress}
        > {props.content} </Button>
    )
}

export default AppButton

