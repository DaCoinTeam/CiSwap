"use client"
import { Tab, Tabs } from "@nextui-org/react"
import React from "react"
const Collections = () => {
    const tabs = [
        {
            key: "nfts",
            text: "NFTs",
            handleOnPress: () => {}

        },
        {
            key: "activity",
            text: "Activity",
            handleOnPress: () => {}
        }
    ]
    return (
        <div>
            <Tabs 
                aria-label="Options" 
                color="primary" 
                className="w-full"
                variant="underlined"
                classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-teal-500",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-teal-500"
                }}
            >
                {
                    tabs.map(tab => (
                        <Tab
                            key={tab.key}
                            text={
                                <div className="flex font-bold items-center space-x-2 px-4">
                                    {tab.text}
                                </div>
                            }
                        />
                    ))
                }
               
                
               
            </Tabs>
        </div>) 
}

export default Collections