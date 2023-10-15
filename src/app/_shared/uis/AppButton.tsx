import React from "react"
import { Button } from "@nextui-org/react"

interface AppButtonProps {
  className?: string;
  darkMode?: boolean;
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  typeSubmit?: boolean;
  content: string;
  bordered?: boolean;
}

const AppButton = (props: AppButtonProps) => {
    const _variant = props.bordered ? "bordered" : undefined
    const _color = props.bordered ? "border-teal-500" : "bg-teal-500"
    const _size = props.size ?? "md"
    const _bgDarkMode = props.darkMode ? "text-black" : "text-white"
    const _borderDarkMode = "text-teal-500"
    const _submit = props.typeSubmit ? "submit" : undefined
    return (
        <Button
            size={_size}
            type={_submit}
            variant={_variant}
            className={`${_color} font-bold ${
                !props.bordered ? _bgDarkMode : _borderDarkMode
            } ${props.className}`}
            onPress={props.onPress}
        >
            {" "}
            {props.content}{" "}
        </Button>
    )
}

export default AppButton
