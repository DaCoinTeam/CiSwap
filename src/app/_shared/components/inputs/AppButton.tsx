import React from "react"
import { Button } from "@nextui-org/react"

interface AppButtonProps {
  className?: string;
  submit?: boolean;
  text?: string;
  bordered?: boolean;
  onClick?: () => void;
}

const AppButton = (props: AppButtonProps) => {
    const attributes: Attributes = props.bordered
        ? {
            variant: "bordered",
            classNames: "border-teal-500 text-teal-500",
        }
        : {
            classNames: "bg-teal-500",
        }
    return (
        <Button
            type={props.submit ? "submit" : undefined}
            variant={attributes.variant}
            className={`${attributes.classNames} font-bold
            } ${props.className}`}
            onPress={props.onClick}
        >
            {" "}
            {props.text}{" "}
        </Button>
    )
}

export default AppButton

interface Attributes {
  variant?: "bordered";
  classNames: string;
}
