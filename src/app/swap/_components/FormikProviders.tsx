import { ERC20Contract } from "@blockchain"
import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import {
    AppDispatch,
    RootState,
    TransactionType,
    setSignatureConfirmationModalInfo,
    setSignatureConfirmationModalToClosed,
} from "@redux"
import { SwapContext } from "../_hooks"
import utils from "@utils"
import { MetamaskContext } from "@app/_hooks"
import { ContextProps, notify } from "@app/_shared"
import { chainInfos } from "@config"
import { Step, services } from "@services"

interface FormikValues {
  amountIn: string;
  amountOut: string;
  amountInRaw: bigint;
  amountOutRaw: bigint;
  steps: Step[];
  exactInput: boolean;
  price: number;
  slippageKey: number;
  slippage: string;
  txDeadline: string;
}

const initialValues: FormikValues = {
    amountIn: "",
    amountOut: "",
    amountInRaw: BigInt(0),
    amountOutRaw: BigInt(0),
    steps: [],
    exactInput: true,
    price: 0,
    slippageKey: 0,
    slippage: "",
    txDeadline: "",
}

export const SLIPPAGE_DEFAULT = 0.001
export const TX_DEADLINE_DEFAULT = 30

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
                if (allowanceIn < values.amountInRaw) {
                    const amountInToApprove = values.amountInRaw - allowanceIn
                    dispatch(
                        setSignatureConfirmationModalInfo({
                            type: TransactionType.Approve,
                            token: {
                                address: swapState.infoIn.address,
                                amount: utils.math.computeRedenomination(
                                    amountInToApprove,
                                    swapState.infoIn.decimals
                                ),
                            },
                        })
                    )

                    const approveInReceipt = await tokenInContract.approve(
                        factory,
                        amountInToApprove
                    )
                    if (!approveInReceipt) {
                        dispatch(setSignatureConfirmationModalToClosed())
                        return
                    }
                    notify(approveInReceipt.transactionHash.toString())
                }

                dispatch(
                    setSignatureConfirmationModalInfo({
                        type: TransactionType.Swap,
                        tokenIn: {
                            address: swapState.infoIn.address,
                            amount: utils.format.parseStringToNumber(values.amountIn),
                        },
                        tokenOut: {
                            address: swapState.infoIn.address,
                            amount: utils.format.parseStringToNumber(values.amountIn),
                        },
                    })
                )

                const params = services.next.smartRouter.createBaseParams(
                    values.amountInRaw,
                    values.amountOutRaw,
                    values.steps,
                    values.exactInput
                )
                console.log(params)
                
                dispatch(
                    setSignatureConfirmationModalToClosed()
                )
            }}
        >
            {(_props) => _renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders
