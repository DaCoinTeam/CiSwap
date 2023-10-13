"use client"
import React, { useContext } from "react"
import { ErrorDisplay, NumberInput, TitleDisplay } from "@app/_shared"
import { Button, Card, CardBody, Spacer } from "@nextui-org/react"
import { RootState } from "@redux"
import { FinishSelectPairContext } from "../index"
import { FormikPropsContext } from "../formik"
import { useSelector } from "react-redux"
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline"
import { parseNumber } from "@utils"

interface ChooseTokenPricesProps {
  className?: string;
}

const ChooseTokenPrices = (props: ChooseTokenPricesProps) => {
    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const token0BasePriceParsed = parseNumber(formik.values.token0BasePrice)
    const token0MaxPriceParsed = parseNumber(formik.values.token0MaxPrice)

    const account = useSelector((state: RootState) => state.blockchain.account)

    const finishSelectPairContext = useContext(FinishSelectPairContext)
    if (finishSelectPairContext == null) return

    const { finishSelectPair } = finishSelectPairContext

    const _finishSelectPair = account != null && finishSelectPair

    const _handleChange = (
        value: string,
        isTokenMax0Card?: boolean
    ) => {
        const priceName = isTokenMax0Card 
            ? "token0MaxPrice" 
            : "token0BasePrice"
        formik.setFieldValue(priceName, value)
    }

    const _renderError = (hasError?: boolean, isTokenMax0Card?: boolean) => {
        const _message = isTokenMax0Card
            ? formik.errors.token0MaxPrice
            : formik.errors.token0BasePrice
        return hasError ? <ErrorDisplay message={_message} /> : null
    }

    const _renderDescription = (isTokenMax0Card?: boolean) => {
        const firstTokenSymbol = formik.values._isToken0Sell
            ? formik.values._token0Symbol
            : formik.values._token1Symbol

        const secondTokenSymbol = formik.values._isToken0Sell
            ? formik.values._token1Symbol
            : formik.values._token0Symbol

        const price = isTokenMax0Card
            ? token0MaxPriceParsed
            : token0BasePriceParsed
        const _message = `1 ${firstTokenSymbol} = ${price} ${secondTokenSymbol}`
        return _finishSelectPair ? <div className="font-bold text-center text-sm"> {_message} </div> : null
    }

    const _onPlusPress = (isTokenMax0Card?: boolean) => {    
        const priceName = isTokenMax0Card 
            ? "token0MaxPrice" 
            : "token0BasePrice"

        const priceValue = isTokenMax0Card
            ? token0MaxPriceParsed
            : token0BasePriceParsed
        
        
        formik.setFieldValue(priceName, priceValue + 1)
    }

    const _onMinusPress = (isTokenMax0Card?: boolean) => {
        const priceName = isTokenMax0Card 
            ? "token0MaxPrice" 
            : "token0BasePrice"

        const priceValue = isTokenMax0Card
            ? token0MaxPriceParsed
            : token0BasePriceParsed
        
        formik.setFieldValue(priceName, priceValue < 1 ? 0 : priceValue - 1)
    }

    return (
        <div className={`${props.className}`}>
            <TitleDisplay title="Choose Token Prices" />
            <Spacer y={4} />
            <div className="grid grid-cols-2 gap-4">
                <div className="grow">
                    <Card>
                        <CardBody>
                            <div className="text-center w-full font-bold text-sm">
                Base Price
                            </div>
                            <Spacer y={6} />
                            <div className="flex gap-4 items-center">
                                <Button
                                    variant="flat"
                                    isIconOnly
                                    onPress={() => _onMinusPress()}
                                    endContent={<MinusIcon height={12} width={12} />}
                                    className="w-5 h-5 min-w-0 flex-none grow hidden sm:inline-flex"
                                    radius="full"
                                />

                                <NumberInput
                                    isDisabled={!_finishSelectPair}
                                    textPosition="center"
                                    errorMessage={formik.errors.token0BasePrice}
                                    onValueChange={_handleChange}
                                    value={_finishSelectPair ? formik.values.token0BasePrice: ""}
                                    hideErrorMessage
                                />
                                
                                <Button
                                    variant="flat"
                                    isIconOnly
                                    onPress={() => _onPlusPress()}
                                    endContent={<PlusIcon height={12} width={12} />}
                                    className="w-5 h-5 min-w-0 flex-none grow hidden sm:inline-flex"
                                    radius="full"
                                />
                            </div>
                            <Spacer y={6} />
                            {_renderDescription()}
                        </CardBody>
                    </Card>
                    {_renderError(formik.errors.token0BasePrice ? true : false)}
                </div>
                <div className="grow">
                    <Card>
                        <CardBody>
                            <div className="text-center w-full font-bold text-sm">
                Max Price
                            </div>
                            <Spacer y={6} />
                            <div className="flex gap-4 items-center">
                                <Button
                                    variant="flat"
                                    isIconOnly
                                    onPress={() => _onMinusPress(true)}
                                    endContent={<MinusIcon height={12} width={12} />}
                                    className="w-5 h-5 min-w-0 flex-none hidden sm:inline-flex"
                                    radius="full"
                                />
                                <NumberInput
                                    isDisabled={!_finishSelectPair}
                                    textPosition="center"
                                    errorMessage={formik.errors.token0MaxPrice}
                                    onValueChange={value => _handleChange(value, true)}
                                    value={_finishSelectPair ? formik.values.token0MaxPrice : ""}
                                />
                                <Button
                                    variant="flat"
                                    isIconOnly
                                    onPress={() => _onPlusPress(true)}
                                    endContent={<PlusIcon height={12} width={12} />}
                                    className="w-5 h-5 min-w-0 flex-none hidden sm:inline-flex"
                                    radius="full"
                                />
                            </div>
                            <Spacer y={6} />
                            {_renderDescription(true)}
                        </CardBody>
                    </Card>
                    {_renderError(formik.errors.token0MaxPrice ? true : false, true)}
                </div>
            </div>
        </div>
    )
}
export default ChooseTokenPrices
