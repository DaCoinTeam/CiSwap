
import React from "react"
import { Textarea } from "@nextui-org/react"
import { sanitizeNumericInput } from "@utils"

interface NumberTextareaProps {
    className?: string,
    size?: "sm" | "md" | "lg",
    onValueChange: (value: string) => void,
    value: string,
    errorMessage? : string,
    textPosition?: "center" | "left" | "right",
    isDisabled?: boolean,
    hideErrorMessage?: boolean
}

const NumberTextarea = (props: NumberTextareaProps) => {
    const _textPosition = props.textPosition ?? "left"

    let _textPositionClassName = ""
    switch (_textPosition){
    case "center": _textPositionClassName = "text-center"
        break
    case "left": _textPositionClassName = "text-left"
        break
    case "right": _textPositionClassName = "text-right"
        break
    }

    const _handleChange = (
        value: string
    ) => {
        const sanitizeInput = sanitizeNumericInput(value)
        if (sanitizeInput != null) {
            props.onValueChange(sanitizeInput)
        } 
    }

    return (
        <Textarea 
            labelPlacement="outside"
            classNames={{
                input: _textPositionClassName
            }}
            radius="sm"
            isDisabled = {props.isDisabled}
            placeholder="0.0"
            className={`${props.className}`} 
            value={props.value} 
            onValueChange={_handleChange}
            isInvalid={props.errorMessage ? true : false}
            errorMessage={!props.hideErrorMessage ? props.errorMessage : ""}
        />
    )
}

export default NumberTextarea

