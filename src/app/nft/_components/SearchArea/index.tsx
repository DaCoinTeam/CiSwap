"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Card, CardBody, Input, Spacer } from "@nextui-org/react"
import React from "react"
import SearchBar from "./SearchBar"

interface SearchAreaProps {
  className?: string
}
const SearchArea = (props: SearchAreaProps) => {
    return (
        <nav className="sticky">
            <div className="max-w-[1280px] m-auto px-6 py-4">
                <SearchBar/>
            </div>
        </nav>
    )
}

export default SearchArea
