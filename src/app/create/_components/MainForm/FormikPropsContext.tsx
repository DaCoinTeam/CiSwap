import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import { Address } from "web3"
import * as Yup from "yup"
import { ERC20Contract, FactoryContract } from "@blockchain"
import { chainInfos } from "@config"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import {
    computeExponent,
    computeDeRedenomination,
    parseNumber,
    computeMultiplyX96,
} from "@utils"
import { MetamaskContext } from "@app/_hooks"
import { ContextProps } from "@app/_shared"

interface FormikValues {
  tokenA: Address;
  tokenB: Address;
  _symbolA: string;
  _symbolB: string;
  _zeroForOne: boolean;
  amountA: string;
  amountB: string;
  _balanceA: number;
  _balanceB: number;
  _decimalsA: number;
  _decimalsB: number;
  basePriceA: string;
  maxPriceA: string;
  _feeId: number;
  fee: number;
}

const initialValues: FormikValues = {
    tokenA: "",
    tokenB: "",
    _symbolA: "",
    _symbolB: "",
    _zeroForOne: true,
    amountA: "",
    amountB: "",
    _balanceA: 0,
    _balanceB: 0,
    _decimalsA: 0,
    _decimalsB: 0,
    basePriceA: "",
    maxPriceA: "",
    _feeId: 0,
    fee: 0.0025,
}

export const FormikPropsContext =
  createContext<FormikProps<FormikValues> | null>(null)

const _renderBody = (
    props: FormikProps<FormikValues> | null,
    chidren: ReactNode
) => (
    <FormikPropsContext.Provider value={props}>
        <Form onSubmit={props?.handleSubmit}>{chidren}</Form>
    </FormikPropsContext.Provider>
)

const FormikProviders = (props: ContextProps) => {
    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext == null) return
    const { web3State } = metamaskContext
    const { web3 } = web3State

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)
    const account = useSelector((state: RootState) => state.blockchain.account)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                tokenA: Yup.string().required(),
                tokenB: Yup.string().required(),
                isToken0Sell: Yup.boolean(),
                amountA: Yup.number().max(
                    Yup.ref("_balanceA"),
                    "Input must not exceed your available balance"
                ),
                amountB: Yup.number().max(
                    Yup.ref("_balanceB"),
                    "Input must not exceed your available balance"
                ),
                basePriceA: Yup.number().max(
                    Yup.ref("maxPriceA"),
                    "Base price must be less than or equal to max price"
                ),
            })}
            onSubmit={async (values) => {
                if (web3 == null) return

                const tokenAContract = new ERC20Contract(
                    chainId,
                    values.tokenA,
                    web3,
                    account
                )
                const tokenBContract = new ERC20Contract(
                    chainId,
                    values.tokenB,
                    web3,
                    account
                )
                
                const factory = chainInfos[chainId].factory
                const factoryContract = new FactoryContract(
                    chainId,
                    factory,
                    web3,
                    account
                )

                const amountADeRedenominated = computeDeRedenomination(
                    parseNumber(values.amountA),
                    values._decimalsA
                )

                const amountBDeRedenominated = computeDeRedenomination(
                    parseNumber(values.amountB),
                    values._decimalsB
                )

                const basePriceAX96 = computeMultiplyX96(
                    parseNumber(values.basePriceA)
                )
                const maxPriceAX96 = computeMultiplyX96(parseNumber(values.maxPriceA))

                const allowanceA = await tokenAContract.allowance(account, factory)
                if (allowanceA == null) return
                if (allowanceA < amountADeRedenominated) {
                    const approveAReceipt = await tokenAContract.approve(
                        factory,
                        amountADeRedenominated - allowanceA
                    )
                    if (!approveAReceipt) return
                }

                const allowanceB = await tokenBContract.allowance(account, factory)
                if (allowanceB == null) return

                if (allowanceB < amountBDeRedenominated) {
                    const approveBReceipt = await tokenBContract.approve(
                        factory,
                        amountBDeRedenominated - allowanceB
                    )
                    if (!approveBReceipt) return
                }

                const _tokenA = values._zeroForOne ? values.tokenA : values.tokenB
                const _tokenB = values._zeroForOne ? values.tokenB : values.tokenA

                const _amountA = values._zeroForOne
                    ? amountADeRedenominated
                    : amountBDeRedenominated
                const _amountB = values._zeroForOne
                    ? amountADeRedenominated
                    : amountBDeRedenominated

                console.log({
                    fee: values.fee * computeExponent(5),
                    config: {
                        tokenA: _tokenA,
                        tokenB: _tokenB,
                        amountA: _amountA,
                        amountB: _amountB,
                        basePriceAX96: basePriceAX96,
                        maxPriceAX96: maxPriceAX96,
                    },
                })
                console.log( chainInfos[chainId].factory)
                const createPoolReceipt = await factoryContract.createPool({
                    fee: values.fee * computeExponent(5),
                    config: {
                        tokenA: _tokenA,
                        tokenB: _tokenB,
                        amountA: _amountA,
                        amountB: _amountB,
                        basePriceAX96: basePriceAX96,
                        maxPriceAX96: maxPriceAX96,
                    },
                })
                console.log(createPoolReceipt)
            }}
        >
            {(_props) => _renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders
