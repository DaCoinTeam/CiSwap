"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Input } from "@nextui-org/react"
import React from "react"

const SearchInput = () => {
    return (
        <div>
            <Input
                placeholder="Search pair or token"
                labelPlacement="outside"
                startContent={
                    <MagnifyingGlassIcon height={16} width={16} />
                }
            />
        </div>
    )
}
export default SearchInput