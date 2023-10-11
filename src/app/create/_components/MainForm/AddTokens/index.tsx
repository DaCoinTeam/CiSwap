"use client"
import React, { ChangeEvent, useContext, useEffect } from "react"
import { BalanceDisplay, TitleDisplay, TokenDisplay } from "@app/_shared"
import { Input, Select, SelectItem, Spacer } from "@nextui-org/react"
import { FinishSelectPairContext } from "../index"
import { RootState } from "@redux"
import { FormikPropsContext } from "../formik"
import { useSelector } from "react-redux"
import { ERC20Contract } from "@blockchain"
import { calculateRedenomination } from "@utils"

interface AddTokensProps {
  className?: string;
}

const AddTokens = (props: AddTokensProps) => {
    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const chainName = useSelector((state: RootState) => state.blockchain.chainName)
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
        console.log(event)
        formik.setFieldValue(
            "_isToken0Sell",
            event.target.value == formik.values.token0Address
        )
    }

    useEffect(() => {
        const handleEffect = async () => {
            const token0Contract = new ERC20Contract(chainName, formik.values.token0Address)
            const token0Balance = await token0Contract.balanceOf(account)
            if (token0Balance == null) return

            const token0Decimals = await token0Contract.decimals()
            if (token0Decimals == null) return
            
            formik.setFieldValue("_token0Balance", calculateRedenomination(token0Balance, token0Decimals, 3))

            const token1Contract = new ERC20Contract(chainName, formik.values.token1Address)
            const token1Balance = await token1Contract.balanceOf(account)
            if (token1Balance == null) return

            const token1Decimals = await token1Contract.decimals()
            if (token1Decimals == null) return
            
            formik.setFieldValue("_token1Balance", calculateRedenomination(token1Balance, token1Decimals, 3))
        }
        handleEffect()
    }, 
    [finishSelectPair, account])


    return (
        <div className={props.className}>
            <TitleDisplay title="Add Tokens" />
            <Spacer y={4} />
            <Select
                label="Sell Token"
                className="grow"
                isDisabled={!_finishSelectPair}
                items={_items}
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
            <div className="flex gap-4">
                <div>
                    <div className="flex justify-between items-center">
                        <TokenDisplay tokenSymbol={formik.values._token0Symbol} finishLoad={_finishSelectPair} />
                        <BalanceDisplay tokenBalance={formik.values._token0Balance} finishLoad={_finishSelectPair} />
                    </div>
                    <Input isDisabled={!_finishSelectPair} className="grow mt-1" radius="sm" labelPlacement="outside" size="lg" />
                </div>      
                <div>
                    <div className="flex justify-between items-center">
                        <TokenDisplay tokenSymbol={formik.values._token1Symbol} finishLoad={_finishSelectPair}/>
                        <BalanceDisplay tokenBalance={formik.values._token1Balance} finishLoad={_finishSelectPair} />
                    </div>
                    <Input isDisabled={!_finishSelectPair} className="grow mt-1" radius="sm" labelPlacement="outside" size="lg" />
                </div>
            </div>
        </div>
    )
}

export default AddTokens
