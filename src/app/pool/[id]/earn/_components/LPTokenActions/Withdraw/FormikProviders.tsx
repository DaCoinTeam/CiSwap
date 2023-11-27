import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { LiquidityPoolContract } from "@blockchain"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setWaitSignModalShow, setWaitSignModalTitle } from "@redux"
import { calculateIRedenomination } from "@utils"
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
    if (poolContext == null) return
    const { tokenState, handlers, poolAddress } = poolContext

    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext == null) return 
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
                    tokenState.token1Balance,
                    "Input must not exceed your available balance"
                ),
            })}
            onSubmit={async (values) => {
                console.log("called")
                if (web3 == null || !account) return

                const poolFactory = new LiquidityPoolContract(
                    chainId,
                    poolAddress,
                    web3,
                    account
                )

                dispatch(setWaitSignModalShow(true))
                dispatch(setWaitSignModalTitle("Withdraw"))
                
                const withdrawReceipt = await poolFactory.withdraw(
                    calculateIRedenomination(
                        values.token0AmountOut,
                        tokenState.token0Decimals
                    )
                )
                
                if (!withdrawReceipt){
                    dispatch(setWaitSignModalShow(false))
                    return
                }

                dispatch(setWaitSignModalShow(false))
                notify(withdrawReceipt.transactionHash.toString())
                await handlers._handleWithConnected()
            }}
        >
            {(_props) => _renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders
