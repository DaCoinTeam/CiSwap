
import React from "react"
import { Textarea } from "@nextui-org/react"
import utils from "@utils"

interface NumberTextareaProps {
    className?: string,
    size?: "sm" | "md" | "lg",
    onValueChange: (value: string) => void,
    value: string,
    errorMessage? : string,
    textPosition?: "center" | "left" | "right",
    isDisabled?: boolean,
    readOnly?: boolean,
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
        const sanitizeInput = utils.format.sanitizeNumericInput(value)
        if (sanitizeInput != null) {
            props.onValueChange(sanitizeInput)
        } 
    }

    return (
        <Textarea 
            labelPlacement="outside"
            readOnly={props.readOnly}
            classNames={{
                input: _textPositionClassName,
            }}
            maxLength={72}
            size={props.size}
            radius="sm"
            isDisabled = {props.isDisabled}
            placeholder="0.0"
            className={`${props.className}`} 
            value={props.value} 
            onValueChange={_handleChange}
            isInvalid={!!props.errorMessage}
            errorMessage={!props.hideErrorMessage ? props.errorMessage : ""}
        />
    )
}

export default NumberTextarea

