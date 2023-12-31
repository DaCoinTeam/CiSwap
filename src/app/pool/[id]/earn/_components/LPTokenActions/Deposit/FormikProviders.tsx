import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { ERC20Contract, PoolContract } from "@blockchain"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setWaitSignModalShow, setWaitSignModalTitle } from "@redux"
import {
    computeDeRedenomination,
    computeMultiplyBigIntAndNumber,
    parseNumber,
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

                const token1DepositAmountParsed = computeDeRedenomination(
                    parseNumber(values.token1DepositAmount),
                    tokenState.token1Decimals
                )

                if (token1Allowance < token1DepositAmountParsed) {
                    dispatch(setWaitSignModalShow(true))
                    dispatch(setWaitSignModalTitle("Approve"))
                    const token1ApproveReceipt = await token1Contract.approve(
                        poolAddress,
                        token1DepositAmountParsed - token1Allowance
                    )
                    if (!token1ApproveReceipt) {
                        dispatch(setWaitSignModalShow(false))
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

                dispatch(setWaitSignModalTitle("Deposit"))
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
                    dispatch(setWaitSignModalShow(false))
                    return
                }

                dispatch(setWaitSignModalShow(false))
                notify(depositReceipt.transactionHash.toString())
                await handlers._handleWithConnected()
            }}
        >
            {(_props) => _renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders
