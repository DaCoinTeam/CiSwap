import { ERC20Contract } from "@blockchain"
import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import {
    AppDispatch,
    RootState,
    setWaitSignModalShow,
    setWaitSignModalTitle,
} from "@redux"
import { SwapContext } from "../_hooks"
import utils from "@utils"
import { MetamaskContext } from "@app/_hooks"
import { ContextProps, notify } from "@app/_shared"
import { chainInfos } from "@config"
import { Step } from "@services"

interface FormikValues {
  amountIn: string;
  amountOut: string;
  amountInRaw: bigint;
  amountOutRaw: bigint;
  steps: Step[];
  slippage: number;
  exactInput: boolean;
  price: number;
}

const initialValues: FormikValues = {
    amountIn: "",
    amountOut: "",
    amountInRaw: BigInt(0),
    amountOutRaw: BigInt(0),
    steps: [],
    slippage: 0.01,
    exactInput: true,
    price: 0,
}

export const FormikContext = createContext<FormikProps<FormikValues> | null>(
    null
)

const _renderBody = (
    props: FormikProps<FormikValues> | null,
    chidren: ReactNode
) => {
    return (
        <FormikContext.Provider value={props}>
            <Form onSubmit={props?.handleSubmit}>{chidren}</Form>
        </FormikContext.Provider>
    )
}
const FormikProviders = (props: ContextProps) => {
    const { swapState } = useContext(SwapContext)!
    const { web3State } = useContext(MetamaskContext)!
    const { web3 } = web3State

    const dispatch: AppDispatch = useDispatch()

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const account = useSelector((state: RootState) => state.blockchain.account)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                amountIn: Yup.number()
                    .typeError("Input must be a number")
                    .min(0, "Input must be greater than or equal to 0")
                    .max(
                        swapState.infoIn.balance,
                        "Input cannot exceed available balance"
                    )
                    .required("This field is required"),
                amountOut: Yup.number()
                    .typeError("Input must be a number")
                    .min(0, "Input must be greater than or equal to 0")
                    .max(
                        swapState.infoOut.balance,
                        "Input cannot exceed available balance"
                    )
                    .required("This field is required"),
            })}
            onSubmit={async (values) => {
                if (web3 === null || !account) return

                const tokenInContract = new ERC20Contract(
                    chainId,
                    swapState.infoIn.address,
                    web3,
                    account
                )

                const factory = chainInfos[chainId].factory
                const allowanceIn = await tokenInContract.allowance(account, factory)

                if (allowanceIn === null) return

                const parsedAmountIn = utils.math.computeRaw(
                    utils.format.parseNumber(values.amountIn),
                    swapState.infoIn.decimals
                )

                if (allowanceIn < parsedAmountIn) {
                    dispatch(setWaitSignModalShow(true))
                    dispatch(setWaitSignModalTitle("Approve"))

                    const approveInReceipt = await tokenInContract.approve(
                        factory,
                        parsedAmountIn - allowanceIn
                    )
                    if (!approveInReceipt) {
                        dispatch(setWaitSignModalShow(false))
                        return
                    }
                    notify(approveInReceipt.transactionHash.toString())
                }

                dispatch(setWaitSignModalTitle("Swap"))
            }}
        >
            {(_props) => _renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders
