import React from "react"
import { Button } from "@nextui-org/react"
import useDarkMode from "use-dark-mode"

interface AppButtonProps {
  className?: string;
  submit?: boolean;
  text: string;
  bordered?: boolean;
  size?: "sm" | "lg";
  onClick?: () => void;
}

const AppButton = (props: AppButtonProps) => {
    const darkMode = useDarkMode()

    const textColor = darkMode.value ? "text-black" : "text-white"
    return (
        <Button
            color="primary"
            size={props.size}
            type={props.submit ? "submit" : undefined}
            variant={props.bordered ? "bordered" : undefined}
            className={`${props.className}  ${textColor}
           font-bold`}
            onPress={props.onClick}
        >
            {" "}
            {props.text}{" "}
        </Button>
    )
}

export default AppButton
