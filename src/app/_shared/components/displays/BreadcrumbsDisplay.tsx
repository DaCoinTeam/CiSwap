"use client"
import React from "react"
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs"
import { useRouter } from "next/navigation"
import utils from "@utils"

interface BreadcrumbsDisplayProps {
  className?: string;
  items: {
    key: string;
    text: string;
    url?: string;
    isAddress?: boolean;
  }[];
}

const BreadcrumbsDisplay = (props: BreadcrumbsDisplayProps) => {
    const router = useRouter()

    const breadcrumbs: Breadcrumbs[] = props.items.map((item, index) => {
        const url = item.url
        return {
            key: item.key,
            text: item.isAddress ? utils.format.shortenAddress(item.text) : item.text,
            onClick: url ? () => router.push(url) : undefined,
            isLast: props.items.length - 1 === index,
        }
    })

    return (
        <Breadcrumbs
            className={props.className}
            classNames={{
                list: "font-bold",
            }}
        >
            {breadcrumbs.map((breadcrumb) => (
                <BreadcrumbItem key={breadcrumb.key} onPress={breadcrumb.onClick}>
                    <span className={breadcrumb.isLast ? "text-teal-500" : undefined}>
                        {breadcrumb.text}
                    </span>
                </BreadcrumbItem>
            ))}
        </Breadcrumbs>
    )
}

export default BreadcrumbsDisplay

interface Breadcrumbs{
    key: string;
    text: string;
    onClick?: () => void;
    isLast: boolean;
  }