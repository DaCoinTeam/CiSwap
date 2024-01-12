"use client"
import React from "react"
import { Switch } from "@nextui-org/react"
import MoonIcon from "./MoonIcon"
import SunIcon from "./SunIcon"
import useDarkMode from "use-dark-mode"

const SwitchModeButton = () => {
    const darkMode = useDarkMode()

    const onChangeToggle = darkMode.toggle

    return (
        <Switch
            size="lg"
            onValueChange={onChangeToggle}
            isSelected={darkMode.value}
            color="default"
            thumbIcon={darkMode.value ? <MoonIcon /> : <SunIcon />}
        />
    )
}

export default SwitchModeButton
