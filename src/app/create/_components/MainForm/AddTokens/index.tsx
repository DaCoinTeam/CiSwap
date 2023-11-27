"use client"
import React, { ChangeEvent, useContext, useEffect } from "react"
import { BalanceDisplay, NumberInput, TitleDisplay, TokenDisplay } from "@app/_shared"
import { Select, SelectItem, Spacer } from "@nextui-org/react"
import { FinishSelectPairContext } from "../index"
import { RootState } from "@redux"
import { FormikPropsContext } from "../FormikPropsContext"
import { useSelector } from "react-redux"
import { ERC20Contract } from "@blockchain"
import {
    calculateRedenomination
} from "@utils"

interface AddTokensProps {
  className?: string;
}

const AddTokens = (props: AddTokensProps) => {
    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const chainId = useSelector(
        (state: RootState) => state.blockchain.chainId
    )
    const account = useSelector((state: RootState) => state.blockchain.account)

    const finishSelectPairContext = useContext(FinishSelectPairContext)
    if (finishSelectPairContext == null) return

    const { finishSelectPair } = finishSelectPairContext

    const _finishSelectPair = account != null && finishSelectPair

    const _items = _finishSelectPair
        ? [
            {
                tokenAddress: formik.values.token0Address,
                tokenSymbol: formik.values._token0Symbol,
            },
            {
                tokenAddress: formik.values.token1Address,
                tokenSymbol: formik.values._token1Symbol,
            },
        ]
        : []

    const _selectedKey = () => {
        if (!_finishSelectPair) return undefined
        if (formik.values._isToken0Sell) return [formik.values.token0Address]
        return [formik.values.token1Address]
    }

    const _handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        formik.setFieldValue(
            "_isToken0Sell",
            event.target.value == formik.values.token0Address
        )
    }

    const _handleInputChange = (
        value: string,
        isToken1AddedAmount?: boolean
    ) => {
        const addedAmount = isToken1AddedAmount
            ? "token1AddedAmount"
            : "token0AddedAmount"
        formik.setFieldValue(addedAmount, value)
    }

    useEffect(() => {
        const handleEffect = async () => {
            const token0Contract = new ERC20Contract(
                chainId,
                formik.values.token0Address
            )

            const token0Decimals = await token0Contract.decimals()
            if (token0Decimals == null) return
            formik.setFieldValue("_token0Decimals", token0Decimals)

            const token0Balance = await token0Contract.balanceOf(account)
            if (token0Balance == null) return

            formik.setFieldValue(
                "_token0Balance",
                calculateRedenomination(token0Balance, token0Decimals, 3)
            )

            const token1Contract = new ERC20Contract(
                chainId,
                formik.values.token1Address
            )

            const token1Decimals = await token1Contract.decimals()
            if (token1Decimals == null) return
            formik.setFieldValue("_token1Decimals", token0Decimals)

            const token1Balance = await token1Contract.balanceOf(account)
            if (token1Balance == null) return
            formik.setFieldValue(
                "_token1Balance",
                calculateRedenomination(token1Balance, token1Decimals, 3)
            )
        }
        handleEffect()
    }, [finishSelectPair, account])

    return (
        <div className={props.className}>
            <TitleDisplay title="Add Tokens" />
            <Spacer y={4} />
            <Select
                label="Sell Token"
                className="grow"
                isDisabled={!_finishSelectPair}
                items={_items}
                radius="sm"
                selectedKeys={_selectedKey()}
                onChange={_handleChange}
            >
                {_items.map((item) => (
                    <SelectItem key={item.tokenAddress} value={item.tokenAddress}>
                        {item.tokenSymbol}
                    </SelectItem>
                ))}
            </Select>
            <Spacer y={6} />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="flex justify-between items-center  mb-1">
                        <TokenDisplay
                            tokenSymbol={formik.values._token0Symbol}
                            finishLoad={_finishSelectPair}
                        />
                        <BalanceDisplay
                            tokenBalance={formik.values._token0Balance}
                            finishLoad={_finishSelectPair}
                        />
                    </div>
                    <NumberInput
                        onValueChange={_handleInputChange}
                        className="grow"
                        errorMessage={formik.errors.token0AddedAmount}
                        isDisabled={!_finishSelectPair}
                        value={_finishSelectPair ? formik.values.token0AddedAmount : ""}
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <TokenDisplay
                            tokenSymbol={formik.values._token1Symbol}
                            finishLoad={_finishSelectPair}
                        />
                        <BalanceDisplay
                            tokenBalance={formik.values._token1Balance}
                            finishLoad={_finishSelectPair}
                        />
                    </div>
                    <NumberInput
                        onValueChange={value => _handleInputChange(value, true)}
                        className="grow"
                        errorMessage={formik.errors.token1AddedAmount}
                        isDisabled={!_finishSelectPair}
                        value={_finishSelectPair ? formik.values.token1AddedAmount : ""}
                    />
                </div>
            </div>
        </div>
    )
}

export default AddTokens
