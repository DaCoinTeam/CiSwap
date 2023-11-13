import { ERC20Contract, LiquidityPoolContract } from "@blockchain"
import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setOpenWaitSignModalShow, setOpenWaitSignModalTitle } from "@redux"
import { PoolAddressContext, TokenStateContext, UpdateTokenStateContext } from "../../../layout"
import { parseNumber } from "@utils"
import { calculateIRedenomination, calculateMuvBigIntNumber } from "@utils"

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

const FormikProviders = ({ children }: { children: ReactNode}) => {

    const poolAddress = useContext(PoolAddressContext)
    if (poolAddress == null) return

    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const updateTokenState = useContext(UpdateTokenStateContext)
    if (updateTokenState == null) return 
    
    const dispatch : AppDispatch = useDispatch()
    const notify = useSelector((state: RootState) => state.configuration.notify)

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )
    const web3 = useSelector(
        (state: RootState) => state.blockchain.web3
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

                const tokenInContract = new ERC20Contract(chainName, tokenInAddress, web3, account)

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
                    dispatch(setOpenWaitSignModalShow(true))
                    dispatch(setOpenWaitSignModalTitle("Approve"))

                    const tokenInApproveReceipt = await tokenInContract.approve(
                        poolAddress,
                        tokenAmountInParsed - tokenInAllowance
                    )
                    if (!tokenInApproveReceipt) {
                        dispatch(setOpenWaitSignModalShow(false))
                        return
                    }
                    notify(tokenInApproveReceipt.transactionHash.toString())
                }

                

                const poolFactory = new LiquidityPoolContract(
                    chainName,
                    poolAddress,
                    web3,
                    account
                )

                dispatch(setOpenWaitSignModalTitle("Swap"))

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
                    dispatch(setOpenWaitSignModalShow(false))
                    return
                }

                dispatch(setOpenWaitSignModalShow(false))
                notify(depositReceipt.transactionHash.toString())
                await updateTokenState._handleAll()
            }
            }
        >
            {(props) => _renderBody(props, children)}
        </Formik>
    )
}

export default FormikProviders
