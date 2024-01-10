"use client"
import React, { useState } from "react"
import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@nextui-org/react"
import { Logo } from "./Logo"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import ConnectWalletButton from "./ConnectWalletButton"
import ConnectedWalletSelect from "./ConnectedWalletSelect"
import { useRouter } from "next/navigation"
import ConnectedChain from "./ConnectedChain"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const account = useSelector((state: RootState) => state.blockchain.account)
    const defaultPool = useSelector(
        (state: RootState) => state.blockchain.defaultPool
    )

    const router = useRouter()

    const _pushHome = () => router.push("/")
    const _pushInfo = () => router.push("/info")
    const _pushSwap = () => router.push(`/pool/${defaultPool}/swap`)
    const _pushEarn = () => router.push(`/pool/${defaultPool}/earn`)
    const _pushBuy = () => router.push("/buy")
    const _pushCreatePool = () => router.push("/create")

    return (
        <NextUINavbar
            shouldHideOnScroll
            isBordered
            onMenuOpenChange={setIsMenuOpen}
            maxWidth="full"
            classNames={
                {
                    wrapper: "max-w-[1280px]"
                }
            }

        >
            <NavbarContent className="gap-12">
                <div>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand className="cursor-pointer" onClick={_pushHome}>
                        <Logo />
                        <p className="font-bold text-inherit">CiSwap</p>
                    </NavbarBrand>
                </div>

                <div className="hidden sm:flex gap-4">
                    <NavbarItem>
                        <Link
                            color="foreground"
                            className="cursor-pointer"
                            onPress={_pushInfo}
                        >
              Info
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link className="text-teal-500 cursor-pointer" onPress={_pushSwap}>
              Swap
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link
                            color="foreground"
                            className="cursor-pointer"
                            onPress={_pushEarn}
                        >
              Earn
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link
                            color="foreground"
                            className="cursor-pointer"
                            onPress={_pushBuy}
                        >
              Buy
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link
                            color="foreground"
                            className="cursor-pointer"
                            onPress={_pushCreatePool}
                        >
              Create
                        </Link>
                    </NavbarItem>
                </div>
            </NavbarContent>

            <NavbarContent justify="end" className="gap-12">
                <ConnectedChain />
                <div>
                    {account === "" ? <ConnectWalletButton /> : <ConnectedWalletSelect />}
                </div>
            </NavbarContent>

            <NavbarMenu>
                <NavbarMenuItem>
                    <Link
                        color="foreground"
                        className="cursor-pointer"
                        onPress={_pushHome}
                    >
            Home
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link className="text-teal-500 cursor-pointer" onPress={_pushSwap}>
            Swap
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        color="foreground"
                        className="cursor-pointer"
                        onPress={_pushEarn}
                    >
            Earn
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        color="foreground"
                        className="cursor-pointer"
                        onPress={_pushInfo}
                    >
            Info
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        color="foreground"
                        className="cursor-pointer"
                        onPress={_pushCreatePool}
                    >
            Create Pool
                    </Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </NextUINavbar>
    )
}

export default Navbar
