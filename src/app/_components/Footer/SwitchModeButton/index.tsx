"use client"
import React from "react"
import { Switch } from "@nextui-org/react"
import MoonIcon from "./MoonIcon"
import SunIcon from "./SunIcon"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setDarkMode } from "@redux"
const SwitchModeButton = () => {
    const darkMode = useSelector((state: RootState) => state.configuration.darkMode)
    const dispatch: AppDispatch = useDispatch()

    const onChangeToggle = () => dispatch(setDarkMode(!darkMode))

    return (
        <Switch
            size="lg"
            onValueChange={onChangeToggle}
            isSelected={darkMode}
            color="default"
            thumbIcon={darkMode ? <MoonIcon /> : <SunIcon />}
        />
    )
}

export default SwitchModeButton
