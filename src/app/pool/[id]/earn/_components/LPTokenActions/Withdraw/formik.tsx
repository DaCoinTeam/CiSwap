import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { LiquidityPoolContract } from "@blockchain"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setOpenWaitSignModalShow, setOpenWaitSignModalTitle } from "@redux"
import { calculateIRedenomination } from "@utils"
import {
    PoolAddressContext,
    TokenStateContext,
    UpdateTokenStateContext,
} from "../../../../layout"

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

const FormikProviders = ({ children }: { children: ReactNode }) => {
    const poolAddress = useContext(PoolAddressContext)
    if (poolAddress == null) return

    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const updateTokenState = useContext(UpdateTokenStateContext)
    if (updateTokenState == null) return

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const dispatch : AppDispatch = useDispatch()
    const notify = useSelector((state: RootState) => state.configuration.notify)

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
                if (web3 == null || !account) return

                const poolFactory = new LiquidityPoolContract(
                    chainName,
                    poolAddress,
                    web3,
                    account
                )

                dispatch(setOpenWaitSignModalShow(true))
                dispatch(setOpenWaitSignModalTitle("Withdraw"))
                
                const withdrawReceipt = await poolFactory.withdraw(
                    calculateIRedenomination(
                        values.token0AmountOut,
                        tokenState.token0Decimals
                    )
                )
                
                if (!withdrawReceipt){
                    dispatch(setOpenWaitSignModalShow(false))
                    return
                }

                dispatch(setOpenWaitSignModalShow(false))
                notify(withdrawReceipt.transactionHash.toString())
                await updateTokenState._handleWithConnected()
            }}
        >
            {(props) => _renderBody(props, children)}
        </Formik>
    )
}

export default FormikProviders
