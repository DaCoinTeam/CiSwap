"use client"
import React from "react"
import SearchInput from "./SearchInput"
import SectionTab from "./SectionTab"

const SearchBar = () => {
    return (
        <div className="mx-0">
            <div className="justify-between flex items-center">         
                <SectionTab />
                <SearchInput />
            </div>
        </div>
    )
}

export default SearchBar