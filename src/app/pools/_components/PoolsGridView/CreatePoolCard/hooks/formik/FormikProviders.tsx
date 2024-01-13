import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import { Address } from "web3"
import * as Yup from "yup"
import { ERC20Contract, FactoryContract } from "@blockchain"
import { chainInfos } from "@config"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { format, math } from "@utils"
import { MetamaskContext } from "@app/_hooks"
import { ProvidersProps } from "@app/_shared"

interface FormikValues {
  tokenA: Address;
  tokenB: Address;
  symbolA: string;
  symbolB: string;
  zeroForOne: boolean;
  amountA: string;
  amountB: string;
  balanceA: number;
  balanceB: number;
  decimalsA: number;
  decimalsB: number;
  priceABase: string;
  priceAMax: string;
  feeKey: number;
  fee: number;
}

const initialValues: FormikValues = {
    tokenA: "",
    tokenB: "",
    symbolA: "",
    symbolB: "",
    zeroForOne: true,
    amountA: "",
    amountB: "",
    balanceA: 0,
    balanceB: 0,
    decimalsA: 0,
    decimalsB: 0,
    priceABase: "",
    priceAMax: "",
    feeKey: 0,
    fee: 0.0025,
}

export const FormikContext = createContext<FormikProps<FormikValues> | null>(
    null
)

const FormikWrapper = (props: {
  formik: FormikProps<FormikValues> | null;
  children: ReactNode;
}) => (
    <FormikContext.Provider value={props.formik}>
        <Form onSubmit={props.formik?.handleSubmit}>{props.children}</Form>
    </FormikContext.Provider>
)

const FormikProviders = (props: ProvidersProps) => {
    const { web3State } = useContext(MetamaskContext)!
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
                    Yup.ref("balanceA"),
                    "Input must not exceed your available balance"
                ),
                amountB: Yup.number().max(
                    Yup.ref("balanceB"),
                    "Input must not exceed your available balance"
                ),
                priceABase: Yup.number().max(
                    Yup.ref("priceAMax"),
                    "Base price must be less than or equal to max price"
                ),
            })}
            onSubmit={async (values) => {
                if (web3 === null) return

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

                const amountARaw = math.blockchain.computeRaw(
                    format.parseStringToNumber(values.amountA),
                    values.decimalsA
                )

                const amountBRaw = math.blockchain.computeRaw(
                    format.parseStringToNumber(values.amountB),
                    values.decimalsB
                )

                const priceABaseX96 = math.blockchain.computeMultiplyX96(
                    format.parseStringToNumber(values.priceABase)
                )
                const priceAMaxX96 = math.blockchain.computeMultiplyX96(
                    format.parseStringToNumber(values.priceAMax)
                )

                const allowanceA = await tokenAContract.allowance(account, factory)

                if (allowanceA === null) return
                if (allowanceA < amountARaw) {
                    const approveAReceipt = await tokenAContract.approve(
                        factory,
                        amountARaw - allowanceA
                    )
                    if (!approveAReceipt) return
                }

                const allowanceB = await tokenBContract.allowance(account, factory)
                if (allowanceB === null) return

                if (allowanceB < amountBRaw) {
                    const approveBReceipt = await tokenBContract.approve(
                        factory,
                        amountBRaw - allowanceB
                    )
                    if (!approveBReceipt) return
                }

                const _tokenA = values.zeroForOne ? values.tokenA : values.tokenB
                const _tokenB = values.zeroForOne ? values.tokenB : values.tokenA

                const _amountA = values.zeroForOne ? amountARaw : amountBRaw
                const _amountB = values.zeroForOne ? amountBRaw : amountARaw
                console.log({
                    fee: values.fee * math.base.computeExponent(5),
                    config: {
                        tokenA: _tokenA,
                        tokenB: _tokenB,
                        amountA: _amountA,
                        amountB: _amountB,
                        priceABaseX96: priceABaseX96,
                        priceAMaxX96: priceAMaxX96,
                    },
                })
                const createPoolReceipt = await factoryContract.createPool({
                    fee: values.fee * math.base.computeExponent(5),
                    config: {
                        tokenA: _tokenA,
                        tokenB: _tokenB,
                        amountA: _amountA,
                        amountB: _amountB,
                        priceABaseX96: priceABaseX96,
                        priceAMaxX96: priceAMaxX96,
                    },
                })
                console.log(createPoolReceipt)
            }}
        >
            {(_props) => (
                <FormikWrapper formik={_props}> {props.children}</FormikWrapper>
            )}
        </Formik>
    )
}

export default FormikProviders
