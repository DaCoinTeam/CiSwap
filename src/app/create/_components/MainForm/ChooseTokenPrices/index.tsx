"use client"
import React, { useContext } from "react"
import { ErrorDisplay, NumberInput, TitleDisplay } from "@app/_shared"
import { Button, Card, CardBody, Spacer } from "@nextui-org/react"
import { RootState } from "@redux"
import { FinishSelectedPairContext } from "../index"
import { FormikContext } from "../../../_hooks"
import { useSelector } from "react-redux"
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline"
import utils from "@utils"

interface ChooseTokenPricesProps {
  className?: string;
}

const ChooseTokenPrices = (props: ChooseTokenPricesProps) => {
    const formik = useContext(FormikContext)!

    const priceABaseParsed = utils.format.parseStringToNumber(formik.values.priceABase)
    const priceAMaxParsed = utils.format.parseStringToNumber(formik.values.priceAMax)

    const account = useSelector((state: RootState) => state.blockchain.account)

    const { finishSelectedPair } = useContext(FinishSelectedPairContext)!

    const _finishSelectedPair = account != null && finishSelectedPair

    const onChangeInput = (value: string, isTokenAMax?: boolean) => {
        const priceName = isTokenAMax ? "priceAMax" : "priceABase"
        formik.setFieldValue(priceName, value)
    }

    const renderError = (hasError?: boolean, isTokenAMax?: boolean) => {
        const _message = isTokenAMax
            ? formik.errors.priceAMax
            : formik.errors.priceABase
        return hasError ? <ErrorDisplay message={_message} /> : null
    }

    const renderDescription = (isTokenAMax?: boolean) => {
        const firstTokenSymbol = formik.values.zeroForOne
            ? formik.values.symbolA
            : formik.values.symbolB

        const secondTokenSymbol = formik.values.zeroForOne
            ? formik.values.symbolB
            : formik.values.symbolA

        const price = isTokenAMax ? priceAMaxParsed : priceABaseParsed
        const _message = `1 ${firstTokenSymbol} = ${price} ${secondTokenSymbol}`
        return _finishSelectedPair ? (
            <div className="font-bold text-center text-sm"> {_message} </div>
        ) : null
    }

    const onClickIncrease = (isTokenAMax?: boolean) => {
        const priceName = isTokenAMax ? "priceAMax" : "priceABase"

        const priceValue = isTokenAMax ? priceAMaxParsed : priceABaseParsed

        formik.setFieldValue(priceName, priceValue + 1)
    }

    const onClickDecrease = (isTokenAMax?: boolean) => {
        const priceName = isTokenAMax ? "priceAMax" : "priceABase"

        const priceValue = isTokenAMax ? priceAMaxParsed : priceABaseParsed

        formik.setFieldValue(priceName, priceValue < 1 ? 0 : priceValue - 1)
    }

    return (
        <div className={`${props.className}`}>
            <TitleDisplay text="Choose Token Prices" />
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
                                    onPress={() => onClickDecrease()}
                                    endContent={<MinusIcon height={12} width={12} />}
                                    className="w-5 h-5 min-w-0 flex-none grow hidden sm:inline-flex"
                                    radius="full"
                                />

                                <NumberInput
                                    isDisabled={!_finishSelectedPair}
                                    textPosition="center"
                                    errorMessage={formik.errors.priceABase}
                                    onChange={onChangeInput}
                                    value={_finishSelectedPair ? formik.values.priceABase : ""}
                                    hideErrorMessage
                                />

                                <Button
                                    variant="flat"
                                    isIconOnly
                                    onPress={() => onClickIncrease()}
                                    endContent={<PlusIcon height={12} width={12} />}
                                    className="w-5 h-5 min-w-0 flex-none grow hidden sm:inline-flex"
                                    radius="full"
                                />
                            </div>
                            <Spacer y={6} />
                            {renderDescription()}
                        </CardBody>
                    </Card>
                    {renderError(!!formik.errors.priceABase)}
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
                                    onPress={() => onClickDecrease(true)}
                                    endContent={<MinusIcon height={12} width={12} />}
                                    className="w-5 h-5 min-w-0 flex-none hidden sm:inline-flex"
                                    radius="full"
                                />
                                <NumberInput
                                    isDisabled={!_finishSelectedPair}
                                    textPosition="center"
                                    errorMessage={formik.errors.priceAMax}
                                    onChange={(value) => onChangeInput(value, true)}
                                    value={_finishSelectedPair ? formik.values.priceAMax : ""}
                                />
                                <Button
                                    variant="flat"
                                    isIconOnly
                                    onPress={() => onClickIncrease(true)}
                                    endContent={<PlusIcon height={12} width={12} />}
                                    className="w-5 h-5 min-w-0 flex-none hidden sm:inline-flex"
                                    radius="full"
                                />
                            </div>
                            <Spacer y={6} />
                            {renderDescription(true)}
                        </CardBody>
                    </Card>
                    {renderError(!!formik.errors.priceAMax, true)}
                </div>
            </div>
        </div>
    )
}
export default ChooseTokenPrices
