import React from "react"
import {Switch} from "@nextui-org/react"
import {MoonIcon} from "./MoonIcon"
import {SunIcon} from "./SunIcon"

export const SwitchModeButton = () => {
    return (
        <Switch
            defaultSelected
            size="lg"
            color="success"
            startContent={<SunIcon />}
            endContent={<MoonIcon />}
        >
      Dark mode
        </Switch>
    )
}
