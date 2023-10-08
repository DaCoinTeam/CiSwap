"use client"
import React from "react"
import {Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenu, NavbarMenuItem, NavbarMenuToggle} from "@nextui-org/react"
import { Logo } from "./Logo"

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

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
        <NextUINavbar onMenuOpenChange={setIsMenuOpen}>
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
                <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
                    </Button>
                </NavbarItem>
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
