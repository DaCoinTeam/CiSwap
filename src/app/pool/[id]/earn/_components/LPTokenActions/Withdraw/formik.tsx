import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { ERC20Contract, LiquidityPoolContract } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { calculateIRedenomination, parseNumber } from "@utils"
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

                const LPTokenContract = new ERC20Contract(
                    chainName,
                    poolAddress,
                    web3,
                    account
                )

                const LPTokenAllowance = await LPTokenContract.allowance(
                    account,
                    poolAddress
                )
                if (LPTokenAllowance == null) return

                const LPTokenAmountInParsed = calculateIRedenomination(
                    parseNumber(values.LPTokenAmountIn),
                    tokenState.token1Decimals
                )

                if (LPTokenAllowance < LPTokenAmountInParsed) {
                    const LPTokenApproveReceipt = await LPTokenContract.approve(
                        poolAddress,
                        LPTokenAmountInParsed - LPTokenAllowance
                    )
                    if (!LPTokenApproveReceipt) return
                }

                const poolFactory = new LiquidityPoolContract(
                    chainName,
                    poolAddress,
                    web3,
                    account
                )

                const withdrawReceipt = await poolFactory.withdraw(
                    calculateIRedenomination(
                        values.token0AmountOut,
                        tokenState.token0Decimals
                    )
                )
                console.log(withdrawReceipt)
                await updateTokenState._handleWithConnected()
            }}
        >
            {(props) => _renderBody(props, children)}
        </Formik>
    )
}

export default FormikProviders
