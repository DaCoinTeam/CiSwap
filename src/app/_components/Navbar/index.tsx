"use client"
import React from "react"
import {Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenu, NavbarMenuItem, NavbarMenuToggle} from "@nextui-org/react"
import { Logo } from "./Logo"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import ConnectWalletButton from "./ConnectWalletButton"
import ConnectedWalletSelect from "./ConnectedWalletSelect"
import { useRouter } from "next/navigation"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const account = useSelector((state: RootState) => state.blockchain.account)
    const defaultPool = useSelector((state: RootState) => state.blockchain.defaultPool)

    const router = useRouter()


    const _menuItems = [
        {
            key: 0,
            value: "Profile"
        },
        {
            key: 0,
            value: "Log Out"
        },


    ]

    const _color = (index: number) => index === _menuItems.length - 1 ? "danger" : "foreground"
    const _pushCreatePool = () => router.push("/create")
    const _pushInfo = ()  => router.push("/info")  
    const _pushHome = ()  => router.push("/")  
    const _pushSwap = ()  => router.push(`/pool/${defaultPool}/swap`)  
    const _pushEarn = ()  => router.push(`/pool/${defaultPool}/earn`)  

    return (
        <NextUINavbar shouldHideOnScroll isBordered onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Logo />
                    <p className="font-bold text-inherit">CiSwap</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" className="cursor-pointer" onPress={_pushHome}>
            Home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link className="text-teal-500 cursor-pointer" onPress={_pushSwap}>
            Swap
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" className="cursor-pointer" onPress={_pushEarn}>
            Earn
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" className="cursor-pointer"  onPress={_pushInfo}>
            Info
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground"  className="cursor-pointer"  onPress ={_pushCreatePool}>
            Create Pool
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
                {_menuItems.map((_item) => (
                    <NavbarMenuItem key={_item.key}>
                        <Link
                            color={
                                _item.key === 2 ? "primary" : _color(_item.key)
                            }
                            className="w-full"
                            href="#"
                            size="lg"
                        >
                            {_item.value}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </NextUINavbar>
    )
}

export default Navbar