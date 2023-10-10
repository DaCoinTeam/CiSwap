"use client"
import { TitleDisplay } from "@app/_shared"
import {
    Card,
    CardBody,
    Skeleton,
    Spacer,
    Image
} from "@nextui-org/react"
import React, { useEffect, useState } from "react"
import { ERC20Contract, chainInfos } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { Address } from "web3"
import { getSvgResponse } from "@app/api/_utils"

interface SelectStableTokenProps {
  className?: string;
  finishLoad?: boolean;
}

const SelectStableToken = (props: SelectStableTokenProps) => {
    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

  interface PresentableToken {
    tokenAddress: Address;
    tokenSymbol: string;
    tokenImage: string;
  }
  const [presentableTokens, setPresentableTokens] = useState<
    PresentableToken[]
  >([])

  useEffect(() => {
      const handleEffect = async () => {
          const stableTokens = chainInfos[chainName].stableTokenAddresses

          const _presentableTokens: PresentableToken[] = []

          for (const token of stableTokens) {
              const contract = new ERC20Contract(chainName, token)

              const chainId = chainInfos[chainName].chainId
              const symbol = await contract.symbol()
              if (symbol == null) return

              const tokenImage = await getSvgResponse(
                  `api/static/images/token?tokenAddress=${token}&chainId=${chainId}`
              )
            
              _presentableTokens.push({
                  tokenAddress: token,
                  tokenSymbol: symbol,
                  tokenImage
              })
          }

          setPresentableTokens(_presentableTokens)
      }
      handleEffect()
  }, [])

  console.log(presentableTokens)
  return (
      <div>
          <TitleDisplay title="Stable Tokens" />
          <Spacer y={4} />
          <div className="flex gap-4">
              {!props.finishLoad
                  ? presentableTokens.map((token) => (
                      <Card isPressable key={token.tokenAddress}>
                          {" "}
                          <CardBody className="p-4">
                              <Image className="w-12 h-12" radius="full" src={token.tokenImage}/>
                              <Spacer y={4} />
                              <div className="font-bold text-center">{token.tokenSymbol}</div>
                          </CardBody>
                      </Card>
                  ))
                  : [0, 1].map((key) => (
                      <Card key={key} className="col-span-1">
                          <CardBody className="p-4">
                              <Skeleton className="w-12 h-12 rounded-full" />
                              <Spacer y={4} />
                              <Skeleton className="w-12 h-6 rounded" />
                          </CardBody>
                      </Card>
                  ))}
          </div>
      </div>
  )
}

export default SelectStableToken
