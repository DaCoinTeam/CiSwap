"use client"
import React from "react"
import { MainForm } from "./_components"
import { BreadcrumbsDisplay } from "@app/_shared"
import { Spacer } from "@nextui-org/react"

const Page = () => {
    const breadcrumbItems = [
        {
            key: "home",
            url: "/",
            text: "Home",
        }, 
        {
            key: "create",
            text: "Create",
        }
    ]
    return (
        <div className="max-w-[1280px] m-auto px-6 py-12">
            <BreadcrumbsDisplay items={breadcrumbItems}/>
            <Spacer y={12}/>
            <MainForm />
        </div>
    )
}

export default Page
