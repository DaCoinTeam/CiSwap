"use client"
import React from "react"
import SwitchModeButton from "./SwitchModeButton"
import { Divider, Link } from "@nextui-org/react"
import {
    FaFacebook,
    FaGithub,
    FaLinkedin,
    FaInstagram,
    FaDiscord,
    FaTelegram,
} from "react-icons/fa"

const Footer = () => {

    const socials = [
        {
            key: "facebook",
            icon: <FaFacebook />,
            url: "https://www.facebook.com/starci183",
        },
        {
            key: "github",
            icon: <FaGithub />,
            url: "https://github.com/DaCoinTeam",
        },
        {
            key: "linkedin",
            icon: <FaLinkedin />,
            url: "",
        },
        {
            key: "instagram",
            icon: <FaInstagram />,
            url: "https://www.instagram.com/starcii__/",
        },
        {
            key: "discord",
            icon: <FaDiscord />,
            url: "",
        },
        {
            key: "telegram",
            icon: <FaTelegram />,
            url: "",
        },
    ]

    return (
        <footer>
            <div className="max-w-[1280px] m-auto px-6">
                <div className="flex gap-6 py-6">
                    {socials.map((social) => (
                        <Link color="foreground" key={social.key} href={social.url}>
                            {" "}
                            {social.icon}{" "}
                        </Link>
                    ))}
                </div>
                <Divider />
                <div className="flex justify-between my-6">
                    <SwitchModeButton />
          32
                </div>
            </div>
        </footer>
    )
}

export default Footer
