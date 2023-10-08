"use client"
import React from "react"
import {Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenu, NavbarMenuItem, NavbarMenuToggle} from "@nextui-org/react"
import { Logo } from "./Logo"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import ConnectWalletButton from "./ConnectWalletButton"
import ConnectedWalletSelect from "./ConnectedWalletSelect"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const account = useSelector((state: RootState) => state.blockchain.account)

    const menuItems = [
        {
            key: 0,
            value: "Profile"
        },
        {
            key: 0,
            value: "Log Out"
        },


    ]

    const _color = (index: number) => index === menuItems.length - 1 ? "danger" : "foreground"

    return (
        <NextUINavbar shouldHideOnScroll isBordered onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Logo />
                    <p className="font-bold text-inherit">ACME</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
            Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="#" aria-current="page">
            Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
            Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {
                    account == ""
                        ? <ConnectWalletButton />
                        : <ConnectedWalletSelect /> 
                }
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item) => (
                    <NavbarMenuItem key={item.key}>
                        <Link
                            color={
                                item.key === 2 ? "primary" : _color(item.key)
                            }
                            className="w-full"
                            href="#"
                            size="lg"
                        >
                            {item.value}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </NextUINavbar>
    )
}

export default Navbar