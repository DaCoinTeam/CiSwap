import { Button as NextUIButton } from "@nextui-org/react"
import React from "react"

interface PrimaryButtonProps {
  className?: string;
  onPress: () => void;
  label: string;
  variant?: "primary" | "secondary";
}

const Button = (props: PrimaryButtonProps) => {
    
    if (!props.variant) props.variant = "primary"
    const _variant = props.variant ? "flat" : "bordered"
    const _className =
    props.variant == "primary" ? "bg-teal-500" : "border-teal-500"
    
    return (
        <NextUIButton
            variant={_variant}
            className={`${_className} ${props.className}`}
            onPress={props.onPress}
        >
            {" "}
            {props.label}{" "}
        </NextUIButton>
    )
}

export default Button