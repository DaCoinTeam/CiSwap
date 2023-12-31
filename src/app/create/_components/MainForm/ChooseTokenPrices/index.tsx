"use client"
import React, { useContext } from "react"
import { ErrorDisplay, NumberInput, TitleDisplay } from "@app/_shared"
import { Button, Card, CardBody, Spacer } from "@nextui-org/react"
import { RootState } from "@redux"
import { FinishSelectedPairContext } from "../index"
import { FormikPropsContext } from "../FormikPropsContext"
import { useSelector } from "react-redux"
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline"
import utils from "@utils"

interface ChooseTokenPricesProps {
  className?: string;
}

const ChooseTokenPrices = (props: ChooseTokenPricesProps) => {
    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const basePriceAParsed = utils.format.parseNumber(formik.values.basePriceA)
    const maxPriceAParsed = utils.format.parseNumber(formik.values.maxPriceA)

    const account = useSelector((state: RootState) => state.blockchain.account)

    const finishSelectedPairContext = useContext(FinishSelectedPairContext)
    if (finishSelectedPairContext == null) return

    const { finishSelectedPair } = finishSelectedPairContext

    const _finishSelectedPair = account != null && finishSelectedPair

    const _handleChange = (value: string, isTokenAMax?: boolean) => {
        const priceName = isTokenAMax ? "maxPriceA" : "basePriceA"
        formik.setFieldValue(priceName, value)
    }

    const _renderError = (hasError?: boolean, isTokenAMax?: boolean) => {
        const _message = isTokenAMax
            ? formik.errors.maxPriceA
            : formik.errors.basePriceA
        return hasError ? <ErrorDisplay message={_message} /> : null
    }

    const _renderDescription = (isTokenAMax?: boolean) => {
        const firstTokenSymbol = formik.values._zeroForOne
            ? formik.values._symbolA
            : formik.values._symbolB

        const secondTokenSymbol = formik.values._zeroForOne
            ? formik.values._symbolB
            : formik.values._symbolA

        const price = isTokenAMax ? maxPriceAParsed : basePriceAParsed
        const _message = `1 ${firstTokenSymbol} = ${price} ${secondTokenSymbol}`
        return _finishSelectedPair ? (
            <div className="font-bold text-center text-sm"> {_message} </div>
        ) : null
    }

    const _onPlusPress = (isTokenAMax?: boolean) => {
        const priceName = isTokenAMax ? "maxPriceA" : "basePriceA"

        const priceValue = isTokenAMax ? maxPriceAParsed : basePriceAParsed

        formik.setFieldValue(priceName, priceValue + 1)
    }

    const _onMinusPress = (isTokenAMax?: boolean) => {
        const priceName = isTokenAMax ? "maxPriceA" : "basePriceA"

        const priceValue = isTokenAMax ? maxPriceAParsed : basePriceAParsed

        formik.setFieldValue(priceName, priceValue < 1 ? 0 : priceValue - 1)
    }

    return (
        <div className={`${props.className}`}>
            <TitleDisplay title="Choose Token Prices" />
            <Spacer y={4} />
            <div className="grid grid-cols-2 gap-4">
                <div className="grow">
                    <Card>
                        <CardBody className="p-5">
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
                                    isDisabled={!_finishSelectedPair}
                                    textPosition="center"
                                    errorMessage={formik.errors.basePriceA}
                                    onValueChange={_handleChange}
                                    value={_finishSelectedPair ? formik.values.basePriceA : ""}
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
                    {_renderError(!!formik.errors.basePriceA)}
                </div>
                <div className="grow">
                    <Card>
                        <CardBody className="p-5">
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
                                    isDisabled={!_finishSelectedPair}
                                    textPosition="center"
                                    errorMessage={formik.errors.maxPriceA}
                                    onValueChange={(value) => _handleChange(value, true)}
                                    value={_finishSelectedPair ? formik.values.maxPriceA : ""}
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
                    {_renderError(!!formik.errors.maxPriceA, true)}
                </div>
            </div>
        </div>
    )
}
export default ChooseTokenPrices
