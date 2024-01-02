import React from "react"
import { Button } from "@nextui-org/react"

interface AppButtonProps {
  className?: string;
  submit?: boolean;
  text: string;
  bordered?: boolean;
  size?: "sm" | "lg";
  onClick?: () => void;
}

const AppButton = (props: AppButtonProps) => {
    const className = props.bordered
        ? "border-teal-500 text-teal-500"
        : "bg-teal-500"
    return (
        <Button
            size={props.size}
            type={props.submit ? "submit" : undefined}
            variant={props.bordered ? "bordered" : undefined}
            className={`${className}
            ${props.className} font-bold`}
            onPress={props.onClick}
        >
            {" "}
            {props.text}{" "}
        </Button>
    )
}

export default AppButton