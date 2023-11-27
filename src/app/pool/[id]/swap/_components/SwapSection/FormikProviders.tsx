import { ERC20Contract, LiquidityPoolContract } from "@blockchain"
import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setWaitSignModalShow, setWaitSignModalTitle } from "@redux"
import { PoolContext } from "../../../_hooks"
import { parseNumber } from "@utils"
import { calculateIRedenomination, calculateMuvBigIntNumber } from "@utils"
import { MetamaskContext } from "@app/_hooks"
import { ContextProps, notify} from "@app/_shared"

interface FormikValues {
  token0Amount: string;
  token1Amount: string;
  slippage: number;
  _isBuyAction: boolean;
}

const initialValues: FormikValues = {
    token0Amount: "",
    token1Amount: "",
    slippage: 0.01,
    _isBuyAction: false,
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
    
    const dispatch : AppDispatch = useDispatch()

    const chainId = useSelector(
        (state: RootState) => state.blockchain.chainId
    )

    const account = useSelector(
        (state: RootState) => state.blockchain.account
    )

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                token0Amount: Yup.number()
                    .typeError("Input must be a number")
                    .min(0, "Input must be greater than or equal to 0")
                    .max(
                        tokenState.token0Balance,
                        "Input cannot exceed available balance"
                    )
                    .required("This field is required"),
                token1Amount: Yup.number()
                    .typeError("Input must be a number")
                    .min(0, "Input must be greater than or equal to 0")
                    .max(
                        tokenState.token1Balance,
                        "Input cannot exceed available balance"
                    )
                    .required("This field is required"),
            })}
            onSubmit={async (values) => {
                if (web3 == null || !account) return 
                
                const tokenInAddress = !values._isBuyAction ? tokenState.token0Address : tokenState.token1Address
                const tokenAmountIn = !values._isBuyAction ? values.token0Amount : values.token1Amount
                const tokenInDecimals = !values._isBuyAction ? tokenState.token0Decimals : tokenState.token1Decimals

                const tokenInContract = new ERC20Contract(chainId, tokenInAddress, web3, account)

                const tokenInAllowance = await tokenInContract.allowance(
                    account,
                    poolAddress
                )

                if (tokenInAllowance == null) return

                const tokenAmountInParsed = calculateIRedenomination(
                    parseNumber(tokenAmountIn),
                    tokenInDecimals
                )

                if (tokenInAllowance < tokenAmountInParsed) {     
                    dispatch(setWaitSignModalShow(true))
                    dispatch(setWaitSignModalTitle("Approve"))

                    const tokenInApproveReceipt = await tokenInContract.approve(
                        poolAddress,
                        tokenAmountInParsed - tokenInAllowance
                    )
                    if (!tokenInApproveReceipt) {
                        dispatch(setWaitSignModalShow(false))
                        return
                    }
                    notify(tokenInApproveReceipt.transactionHash.toString())
                }

                

                const poolFactory = new LiquidityPoolContract(
                    chainId,
                    poolAddress,
                    web3,
                    account
                )

                dispatch(setWaitSignModalTitle("Swap"))

                const depositReceipt = await poolFactory.swap(
                    tokenAmountInParsed,
                    tokenAmountInParsed -
            calculateMuvBigIntNumber(
                tokenAmountInParsed,
                1 - values.slippage,
                5
            ), values._isBuyAction
                )

                if (!depositReceipt){
                    dispatch(setWaitSignModalShow(false))
                    return
                }

                dispatch(setWaitSignModalShow(false))
                notify(depositReceipt.transactionHash.toString())
                await handlers._handleAll()
            }
            }
        >
            {(_props) => _renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders
