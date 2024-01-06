import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { ERC20Contract, PoolContract } from "@blockchain"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setSignatureConfirmationModalShow, setSignatureConfirmationModalTitle } from "@redux"
import {
    computeRaw,
    computeMultiplyBigIntAndNumber,
    parseStringToNumber,
} from "@utils"
import { PoolContext } from "../../../../_hooks"
import { MetamaskContext } from "@app/_hooks"
import { ContextProps, notify } from "@app/_shared"

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

export const FormikContext =
  createContext<FormikProps<FormikValues> | null>(null)

const renderBody = (
    props: FormikProps<FormikValues> | null,
    chidren: ReactNode
) => (
    <FormikContext.Provider value={props}>
        <Form onSubmit={props?.handleSubmit}>{chidren}</Form>
    </FormikContext.Provider>
)

const FormikProviders = (props: ContextProps) => {
    const poolContext = useContext(PoolContext)
    if (poolContext === null) return
    const { tokenState, handlers, poolAddress } = poolContext

    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext === null) return 
    const { web3State } = metamaskContext
    const { web3 } = web3State

    const chainId = useSelector(
        (state: RootState) => state.blockchain.chainId
    )
    
    const dispatch : AppDispatch = useDispatch()
    
    const account = useSelector((state: RootState) => state.blockchain.account)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                token1DepositAmount: Yup.number().max(
                    tokenState.balanceB,
                    "Input must not exceed your available balance"
                ),
            })}
            onSubmit={async (values) => {
                console.log("called")
                if (web3 === null || !account) return

                const token1Contract = new ERC20Contract(
                    chainId,
                    tokenState.token1,
                    web3,
                    account
                )

                const token1Allowance = await token1Contract.allowance(
                    account,
                    poolAddress
                )
                if (token1Allowance === null) return

                const token1DepositAmountParsed = computeRaw(
                    parseStringToNumber(values.token1DepositAmount),
                    tokenState.token1Decimals
                )

                if (token1Allowance < token1DepositAmountParsed) {
                    dispatch(setSignatureConfirmationModalShow(true))
                    dispatch(setSignatureConfirmationModalTitle("Approve"))
                    const token1ApproveReceipt = await token1Contract.approve(
                        poolAddress,
                        token1DepositAmountParsed - token1Allowance
                    )
                    if (!token1ApproveReceipt) {
                        dispatch(setSignatureConfirmationModalShow(false))
                        return
                    }
                    notify(token1ApproveReceipt.transactionHash.toString())
                }

                const poolFactory = new PoolContract(
                    chainId,
                    poolAddress,
                    web3,
                    account
                )

                dispatch(setSignatureConfirmationModalTitle("Deposit"))
                const depositReceipt = await poolFactory.deposit(
                    token1DepositAmountParsed,
                    token1DepositAmountParsed -
            computeMultiplyBigIntAndNumber(
                token1DepositAmountParsed,
                1 - values.slippage,
                5
            )
                )

                if (!depositReceipt) {
                    dispatch(setSignatureConfirmationModalShow(false))
                    return
                }

                dispatch(setSignatureConfirmationModalShow(false))
                notify(depositReceipt.transactionHash.toString())
                await handlers._handleWithConnected()
            }}
        >
            {(_props) => renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders
