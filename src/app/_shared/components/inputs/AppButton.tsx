import React from "react"
import { Button } from "@nextui-org/react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"

interface AppButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  typeSubmit?: boolean;
  content: string;
  bordered?: boolean;
}

const AppButton = (props: AppButtonProps) => {
    const darkMode = useSelector((state: RootState) => state.configuration.darkMode) 
    const _variant = props.bordered ? "bordered" : undefined
    const _color = props.bordered ? "border-teal-500" : "bg-teal-500"
    const _size = props.size ?? "md"
    const _bgDarkMode = darkMode ? "text-black" : "text-white"
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
