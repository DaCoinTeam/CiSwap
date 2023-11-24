"use client"
import { Avatar } from "@nextui-org/react"
import React from "react"

interface UserAvatarProps{
    className?: string
}
const UserAvatar = (props: UserAvatarProps) => {
    return (
        <>
            <Avatar isBordered radius="full" className={`${props.className} absolute w-40 h-40`} src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
        </>
        
    ) 
}

export default UserAvatar