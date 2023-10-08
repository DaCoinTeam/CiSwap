
import React from "react"
import { Button } from "@nextui-org/react"

interface ButtonProps {
    className?: string,
    darkMode? : boolean,
    size?: "sm" | "md" | "lg",
    onPress?: () => void,
    content: string

}

const AppButton = (props: ButtonProps) => {
    const _size = props.size ?? "md"
    return (
        <Button
            size={_size}
            className={`bg-teal-500 font-bold ${
                props.darkMode ? "text-dark" : "text-light"
            } ${props.className}`}
            onPress={props.onPress}
        > {props.content} </Button>
    )
}

export default AppButton

