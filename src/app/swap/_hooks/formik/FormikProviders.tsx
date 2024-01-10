import {
    ERC20Contract,
    ExactInputParams,
    ExactInputSingleParams,
    ExactOutputParams,
    ExactOutputSingleParams,
    QuoterContract,
    RouterContract,
} from "@blockchain"
import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext, useEffect } from "react"
import * as Yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import {
    AppDispatch,
    RootState,
    TransactionType,
    setSignatureConfirmationModalInfo,
    setSignatureConfirmationModalToClosed,
} from "@redux"
import { SwapContext } from ".."
import utils from "@utils"
import { MetamaskContext } from "@app/_hooks"
import { ContextProps, notify } from "@app/_shared"
import { chainInfos } from "@config"
import { Step, next } from "@services"
import { QuoteType } from "../../../../services/next/smart-router/modules/quote.module"
import { TransactionReceipt } from "web3"

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
export const DEADLINE_DEFAULT = 30
export const AMOUNT_DEFAULT = BigInt(100000)

export const FormikContext = createContext<FormikProps<FormikValues> | null>(
    null
)

const renderBody = (
    props: FormikProps<FormikValues> | null,
    chidren: ReactNode
) => {
    const { swapState } = useContext(SwapContext)!
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const _props = props!

    useEffect(() => {
        if (!swapState.status.finishLoadBeforeConnectWallet) return

        const handleEffect = async () => {
            if (_props.values.steps.length) return
            const quote = await next.smartRouter.findBestQuote(
                chainId,
                AMOUNT_DEFAULT,
                swapState.infoIn.address,
                swapState.infoOut.address,
                _props.values.exactInput
            )
            if (quote === null) return
            _props.setFieldValue("steps", quote.path.steps)
        }
        handleEffect()
    }, [
        swapState.status.finishLoadBeforeConnectWallet,
        swapState.infoIn.address,
    ])

    useEffect(() => {
        const handleEffect = async () => {
            if (!_props.values.steps.length) return

            const path = next.smartRouter.encodePacked(
                _props.values.steps
            )

            const quoterContract = new QuoterContract(
                chainId,
                chainInfos[chainId].quoter
            )

            const priceX96 = await quoterContract.quotePriceX96(path)
            if (priceX96 == null) return
            const price = utils.math.computeDivideX96(priceX96)

            _props.setFieldValue("price", price)
        }
        handleEffect()
    }, [_props.values.steps, swapState.infoIn.address])

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

                const router = chainInfos[chainId].router
                const allowanceIn = await tokenInContract.allowance(account, router)

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
                        router,
                        amountInToApprove
                    )
                    if (!approveInReceipt) {
                        dispatch(setSignatureConfirmationModalToClosed())
                        return
                    }
                    notify(approveInReceipt.transactionHash.toString())
                }

                const routerContract = new RouterContract(
                    chainId,
                    router,
                    web3,
                    account
                )
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

                const swapScenario = next.smartRouter.getSwapScenario(
                    utils.format.parseStringToNumber(values.slippage, SLIPPAGE_DEFAULT),
                    // temp me
                    account,
                    utils.format.parseStringToNumber(values.txDeadline, DEADLINE_DEFAULT),
                    values.amountInRaw,
                    values.amountOutRaw,
                    values.steps,
                    values.exactInput
                )
                console.log("Scen")
                console.log(account)

                let params: SwapParams
                let swapReceipt: TransactionReceipt | null

                switch (swapScenario.quoteType) {
                case QuoteType.ExactInputSingle:
                    params = swapScenario.params
                    swapReceipt = await routerContract.exactInputSingle(params)
                    break
                case QuoteType.ExactInput:
                    params = swapScenario.params
                    swapReceipt = await routerContract.exactInput(params)
                    break
                case QuoteType.ExactOutputSingle:
                    params = swapScenario.params
                    swapReceipt = await routerContract.exactOutputSingle(params)
                    break
                case QuoteType.ExactOutput:
                    params = swapScenario.params
                    swapReceipt = await routerContract.exactOutput(params)
                    break
                }

                if (!swapReceipt) {
                    dispatch(setSignatureConfirmationModalToClosed())
                    return
                }

                dispatch(setSignatureConfirmationModalToClosed())
                notify(swapReceipt.transactionHash.toString())
            }}
        >
            {(_props) => renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders

type SwapParams =
  | ExactInputSingleParams
  | ExactInputParams
  | ExactOutputSingleParams
  | ExactOutputParams;
