import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { ERC20Contract, LiquidityPoolContract } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { TokenState } from "../../../../_definitions"
import {
    calculateIRedenomination,
    calculateMuvBigIntNumber,
    parseNumber,
} from "@utils"
import { PoolAddressContext, UpdateTokenStateContext } from "../../../../layout"

interface FormikValues {
  token1DepositAmount: string;
  LPTokenAmountOut: number;
  slippage: number;
}

const initialValues: FormikValues = {
    token1DepositAmount: "",
    LPTokenAmountOut: 0,
    slippage: 0.01,
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

interface FormikProvidersProps {
  children: ReactNode;
  tokenState: TokenState;
}

const FormikProviders = ({ children, tokenState }: FormikProvidersProps) => {
    const poolAddress = useContext(PoolAddressContext)
    if (poolAddress == null) return
    
    const updateTokenState = useContext(UpdateTokenStateContext)
    if (updateTokenState == null) return

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )
    const web3 = useSelector((state: RootState) => state.blockchain.web3)

    const account = useSelector((state: RootState) => state.blockchain.account)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                token1DepositAmount: Yup.number().max(
                    tokenState.token1Balance,
                    "Input must not exceed your available balance"
                ),
            })}
            onSubmit={async (values) => {
                console.log("called")
                if (web3 == null) return

                const token1Contract = new ERC20Contract(
                    chainName,
                    tokenState.token1Address,
                    web3,
                    account
                )

                const token1Allowance = await token1Contract.allowance(
                    account,
                    poolAddress
                )
                if (token1Allowance == null) return

                const token1DepositAmountParsed = calculateIRedenomination(
                    parseNumber(values.token1DepositAmount),
                    tokenState.token1Decimals
                )

                if (token1Allowance < token1DepositAmountParsed) {
                    const token1ApproveReceipt = await token1Contract.approve(
                        poolAddress,
                        token1DepositAmountParsed - token1Allowance
                    )
                    if (!token1ApproveReceipt) return
                }

                const poolFactory = new LiquidityPoolContract(
                    chainName,
                    poolAddress,
                    web3,
                    account
                )

                const depositReceipt = await poolFactory.deposit(
                    token1DepositAmountParsed,
                    token1DepositAmountParsed -
            calculateMuvBigIntNumber(
                token1DepositAmountParsed,
                1 - values.slippage,
                5
            )
                )
                console.log(depositReceipt)
                await updateTokenState._handleWithConnected()
            }}
        >
            {(props) => _renderBody(props, children)}
        </Formik>
    )
}

export default FormikProviders
