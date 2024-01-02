import React from "react"
import { Button } from "@nextui-org/react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"

interface AppButtonProps {
  className?: string;
  submit?: boolean;
  text: string;
  bordered?: boolean;
  size?: "sm" | "lg";
  onClick?: () => void;
}

const AppButton = (props: AppButtonProps) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    const textColor = darkMode ? "text-black" : "text-white"
    const className = props.bordered
        ? "border-teal-500 text-teal-500"
        : "bg-teal-500"
    return (
        <Button
            size={props.size}
            type={props.submit ? "submit" : undefined}
            variant={props.bordered ? "bordered" : undefined}
            className={`${className}
            ${props.className} ${textColor} font-bold`}
            onPress={props.onClick}
        >
            {" "}
            {props.text}{" "}
        </Button>
    )
}

export default AppButton
