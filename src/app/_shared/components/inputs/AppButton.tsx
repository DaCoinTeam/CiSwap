import React from "react"
import { Button } from "@nextui-org/react"

interface AppButtonProps {
  className?: string;
  type?: Type;
  submit?: boolean;
  text?: string;
  bordered?: boolean;
  onClick?: () => void;
}

const AppButton = (props: AppButtonProps) => {
    const type: Type = props.type ?? 0
    const typeToClassNames: Record<Type, ClassNames> = {
        0: {
            borderOrBackgroundColor: "bg-teal-500",
        },
        1: {
            size: "lg",
            borderOrBackgroundColor: "border-teal-500",
            variant: "bordered",
        },
    }
    const classNames = typeToClassNames[type]
    return (
        <Button
            size={classNames.size}
            type={props.submit ? "submit" : undefined}
            variant={classNames.variant}
            className={`${classNames.borderOrBackgroundColor} font-bold
            } ${props.className}`}
            onPress={props.onClick}
        >
            {" "}
            {props.text}{" "}
        </Button>
    )
}

export default AppButton

type Type = 0 | 1;

interface ClassNames {
  size?: "sm" | "lg";
  variant?: "bordered";
  borderOrBackgroundColor: string;
}
