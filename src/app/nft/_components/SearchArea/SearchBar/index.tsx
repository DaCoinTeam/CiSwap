"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Card, CardBody, Input, Spacer } from "@nextui-org/react"
import { Image } from "@nextui-org/react"
import React from "react"
import { Address } from "web3"

interface SearchBarProps {
  className?: string;
}
const SearchBar = (props: SearchBarProps) => {
    return <Input 
        startContent={<MagnifyingGlassIcon 
            className="w-5 h-5"
        />} 
        placeholder="Search"
        className="max-w-[300px]"
    />
}

export default SearchBar
