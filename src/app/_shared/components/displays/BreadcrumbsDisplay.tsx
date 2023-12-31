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

    const breadcrumbs: {
    key: string;
    text: string;
    handlePress?: () => void;
    isLast: boolean;
  }[] = props.items.map((item, index) => {
      const _url = item.url
      return {
          key: item.key,
          text: item.isAddress ? utils.format.shortenAddress(item.text) : item.text,
          handlePress: _url ? () => router.push(_url) : undefined,
          isLast: props.items.length - 1 === index,
      }
  })

    return (
        <Breadcrumbs
            classNames={{
                list: "font-bold",
            }}
        >
            {breadcrumbs.map((breadcrumb) => (
                <BreadcrumbItem key={breadcrumb.key} onPress={breadcrumb.handlePress}>
                    <span className={breadcrumb.isLast ? "text-teal-500" : undefined}>
                        {breadcrumb.text}
                    </span>
                </BreadcrumbItem>
            ))}
        </Breadcrumbs>
    )
}

export default BreadcrumbsDisplay
