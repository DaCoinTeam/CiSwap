"use client"
import { TitleDisplay } from "@app/_shared"
import { Card, CardBody, Skeleton, Spacer, Image } from "@nextui-org/react"
import React, { useEffect, useState } from "react"
import { ERC20Contract } from "@blockchain"
import { chainInfos } from "@config"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { Address } from "web3"
import { fetchAndCreateSvgBlobUrl } from "@utils"
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"

interface SelectStableTokenProps {
  className?: string;
  onClick: (token: string) => void;
}

const SelectStableToken = (props: SelectStableTokenProps) => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

  interface PresentableToken {
    token: Address;
    symbol: string;
    imageUrl: string | null;
  }
  const [presentableTokens, setPresentableTokens] = useState<
    PresentableToken[]
  >([])

  const [finishLoad, setFinishLoad] = useState(false)

  useEffect(() => {
      const handleEffect = async () => {
          const stableTokens = chainInfos[chainId].stableTokens

          const _presentableTokens: PresentableToken[] = []

          for (const token of stableTokens) {
              const contract = new ERC20Contract(chainId, token)

              const symbol = await contract.symbol()
              if (symbol === null) return

              let imageUrl = await fetchAndCreateSvgBlobUrl(
                  `api/static/images/token?token=${token}&chainId=${chainId}`
              )
              if (imageUrl === null) imageUrl = null

              _presentableTokens.push({
                  token: token,
                  symbol: symbol,
                  imageUrl: imageUrl,
              })

              setFinishLoad(true)
          }

          setPresentableTokens(_presentableTokens)
      }
      handleEffect()
  }, [])

  const _click = (token: Address) => props.onClick(token)
  const _renderCards = (presentableTokens: PresentableToken[]) =>
      presentableTokens.map((token) => (
          <Card
              isPressable
              key={token.token}
              onClick={() => _click(token.token)}
          >
              {" "}
              <CardBody className="p-4">
                  {token.imageUrl ? (
                      <Image className="w-12 h-12" radius="full" src={token.imageUrl} />
                  ) : (
                      <QuestionMarkCircleIcon className="w-12 h-12" />
                  )}

                  <Spacer y={4} />
                  <div className="font-bold text-center">{token.symbol}</div>
              </CardBody>
          </Card>
      ))

  return (
      <div className={`${props.className}`}>
          <TitleDisplay title="Stable Tokens" />
          <Spacer y={4} />
          <div className="flex gap-4">
              {finishLoad
                  ? _renderCards(presentableTokens)
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
