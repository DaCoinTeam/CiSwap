"use client"
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
const CoverPhoto = () => {
    const darkMode = useSelector((state: RootState) => state.configuration.darkMode)
    return (
        <div className={`${darkMode ? "bg-gray-900" : "bg-gray-100"} h-60`}>
            
        </div>) 
}

export default CoverPhoto