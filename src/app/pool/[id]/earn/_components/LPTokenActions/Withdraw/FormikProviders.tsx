import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { PoolContract } from "@blockchain"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setSignatureConfirmationModalShow, setSignatureConfirmationModalTitle } from "@redux"
import { computeRaw } from "@utils"
import { PoolContext } from "../../../../_hooks"
import { MetamaskContext } from "@app/_hooks"
import { ContextProps, notify } from "@app/_shared"

interface FormikValues {
  LPTokenAmountIn: string;
  token0AmountOut: number;
}

const initialValues: FormikValues = {
    LPTokenAmountIn: "",
    token0AmountOut: 0,
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

                const poolFactory = new PoolContract(
                    chainId,
                    poolAddress,
                    web3,
                    account
                )

                dispatch(setSignatureConfirmationModalShow(true))
                dispatch(setSignatureConfirmationModalTitle("Withdraw"))
                
                const withdrawReceipt = await poolFactory.withdraw(
                    computeRaw(
                        values.token0AmountOut,
                        tokenState.token0Decimals
                    )
                )
                
                if (!withdrawReceipt){
                    dispatch(setSignatureConfirmationModalShow(false))
                    return
                }

                dispatch(setSignatureConfirmationModalShow(false))
                notify(withdrawReceipt.transactionHash.toString())
                await handlers._handleWithConnected()
            }}
        >
            {(_props) => renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders
