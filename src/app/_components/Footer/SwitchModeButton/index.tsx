import React from "react"
import { Switch } from "@nextui-org/react"
import { MoonIcon } from "./MoonIcon"
import { SunIcon } from "./SunIcon"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setDarkMode } from "@redux"

export const SwitchModeButton = () => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    const dispatch: AppDispatch = useDispatch()

    const _setDarkMode = (value: boolean) => dispatch(setDarkMode(value))

    return (
        <Switch
            size="lg"
            onValueChange={_setDarkMode}
            isSelected={darkMode}
            color="default"
            thumbIcon={darkMode ? <MoonIcon /> : <SunIcon />}
        />
    )
}
