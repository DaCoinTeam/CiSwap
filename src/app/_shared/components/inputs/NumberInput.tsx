import React, { ReactNode } from "react"
import { Input } from "@nextui-org/react"
import utils from "@utils"

type TextPosition = "center" | "left" | "right";

interface NumberInputProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onChange: (value: string) => void;
  value: string;
  errorMessage?: string;
  textPosition?: TextPosition;
  isDisabled?: boolean;
  hideErrorMessage?: boolean;
  endContent?: ReactNode;
  placeholder?: string;
  radius?: "sm" | "md" | "lg";
  variant?: "bordered" | "underlined" | "flat";
}

const NumberInput = (props: NumberInputProps) => {
    const textPositionToClassName: Record<TextPosition, string> = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    }
    const textPositionClassName =
    textPositionToClassName[props.textPosition ?? "left"]

    const onChange = (value: string) => {
        const sanitizeInput = utils.format.sanitizeNumericInput(value)
        if (sanitizeInput != null) {
            props.onChange(sanitizeInput)
        }
    }

    return (
        <Input
            labelPlacement="outside"
            classNames={{
                input: `${textPositionClassName}`,
            }}
            size={props.size}
            radius={props.radius}
            isDisabled={props.isDisabled}
            placeholder={props.placeholder ?? "0.0"}
            className={`${props.className}`}
            value={props.value}
            variant={props.variant}
            onValueChange={onChange}
            isInvalid={!!props.errorMessage}
            errorMessage={!props.hideErrorMessage ? props.errorMessage : ""}
            endContent={props.endContent}
        />
    )
}

export default NumberInput
