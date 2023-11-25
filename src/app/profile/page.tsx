"use client"
import React from "react"
import { Collections, CoverPhoto, UserAvatar, UserInformation } from "./_components"
import { Spacer } from "@nextui-org/react"

const Page = () => {
    return (
        <>
            <CoverPhoto />
            <div className="max-w-[1024px] m-auto px-6">
                <UserAvatar className="-mt-32"/>
                <div className="pt-12">
                    <UserInformation />
                    <Spacer y={6}/>
                    <Collections />
                </div>
            </div>
        </>
    )
}

export default Page
