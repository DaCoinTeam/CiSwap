"use client"
import React, { ChangeEvent, useContext, useEffect } from "react"
import {
    BalanceDisplay,
    NumberInput,
    TitleDisplay,
    TokenDisplay,
} from "@app/_shared"
import { Select, SelectItem, Spacer } from "@nextui-org/react"
import { FinishSelectedPairContext } from "../index"
import { RootState } from "@redux"
import { FormikPropsContext } from "../FormikPropsContext"
import { useSelector } from "react-redux"
import { ERC20Contract } from "@blockchain"
import utils from "@utils"

interface AddTokensProps {
  className?: string;
}

const DepositTokens = (props: AddTokensProps) => {
    const formik = useContext(FormikPropsContext)
    if (formik === null) return

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)
    const account = useSelector((state: RootState) => state.blockchain.account)

    const finishSelectedPairContext = useContext(FinishSelectedPairContext)
    if (finishSelectedPairContext === null) return

    const { finishSelectedPair } = finishSelectedPairContext

    const _finishSelectedPair = account != null && finishSelectedPair

    const items = _finishSelectedPair
        ? [
            {
                address: formik.values.tokenA,
                symbol: formik.values._symbolA,
            },
            {
                address: formik.values.tokenB,
                symbol: formik.values._symbolB,
            },
        ]
        : []

    const selectedKey = () => {
        if (!_finishSelectedPair) return undefined
        console.log(formik.values.tokenA)
        if (formik.values._zeroForOne) return [formik.values.tokenA]
        return [formik.values.tokenB]
    }

    const onChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        formik.setFieldValue(
            "_zeroForOne",
            event.target.value === formik.values.tokenA
        )
    }

    const onChangeInput = (value: string, isTokenBDeposited?: boolean) => {
        const _amount = isTokenBDeposited ? "amountB" : "amountA"
        formik.setFieldValue(_amount, value)
    }

    useEffect(() => {
        const handleEffect = async () => {
            const tokenAContract = new ERC20Contract(chainId, formik.values.tokenA)

            const decimalsA = await tokenAContract.decimals()
            if (decimalsA === null) return
            formik.setFieldValue("_decimalsA", decimalsA)

            const balanceA = await tokenAContract.balanceOf(account)
            if (balanceA === null) return

            formik.setFieldValue(
                "_balanceA",
                utils.math.computeRedenomination(balanceA, decimalsA)
            )

            const tokenBContract = new ERC20Contract(chainId, formik.values.tokenB)

            const decimalsB = await tokenBContract.decimals()
            if (decimalsB === null) return
            formik.setFieldValue("_decimalsB", decimalsB)

            const balanceB = await tokenBContract.balanceOf(account)
            if (balanceB === null) return
            formik.setFieldValue(
                "_balanceB",
                utils.math.computeRedenomination(balanceB, decimalsB)
            )
        }
        handleEffect()
    }, [finishSelectedPair, account])

    return (
        <div className={props.className}>
            <TitleDisplay title="Deposit Tokens" />
            <Spacer y={4} />
            <Select
                label="Sell Token"
                className="grow"
                isDisabled={!_finishSelectedPair}
                items={items}
                radius="sm"
                selectedKeys={selectedKey()}
                onChange={onChangeSelect}
            >
                {items.map((item) => (
                    <SelectItem key={item.address} value={item.address}>
                        {item.symbol}
                    </SelectItem>
                ))}
            </Select>
            <Spacer y={6} />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="flex justify-between items-center  mb-1">
                        <TokenDisplay
                            symbol={formik.values._symbolA}
                            finishLoad={_finishSelectedPair}
                        />
                        <BalanceDisplay
                            balance={formik.values._balanceA}
                            finishLoad={_finishSelectedPair}
                        />
                    </div>
                    <NumberInput
                        onValueChange={onChangeInput}
                        className="grow"
                        errorMessage={formik.errors.amountA}
                        isDisabled={!_finishSelectedPair}
                        value={_finishSelectedPair ? formik.values.amountA : ""}
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <TokenDisplay
                            symbol={formik.values._symbolB}
                            finishLoad={_finishSelectedPair}
                        />
                        <BalanceDisplay
                            balance={formik.values._balanceB}
                            finishLoad={_finishSelectedPair}
                        />
                    </div>
                    <NumberInput
                        onValueChange={(value) => onChangeInput(value, true)}
                        className="grow"
                        errorMessage={formik.errors.amountB}
                        isDisabled={!_finishSelectedPair}
                        value={_finishSelectedPair ? formik.values.amountB : ""}
                    />
                </div>
            </div>
        </div>
    )
}

export default DepositTokens
