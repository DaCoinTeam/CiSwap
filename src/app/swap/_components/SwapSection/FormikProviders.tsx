import { Call, ERC20Contract, PoolContract, RouterContract } from "@blockchain"
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
import { SwapContext } from "../../_hooks"
import { parseNumber } from "@utils"
import { computeDeRedenomination } from "@utils"
import { MetamaskContext } from "@app/_hooks"
import { ContextProps, notify } from "@app/_shared"
import { Address } from "web3"
import { chainInfos } from "../../../../config/blockchain.config"

interface FormikValues {
  amountIn: string;
  amountOut: string;
  slippage: number;
}

const initialValues: FormikValues = {
    amountIn: "",
    amountOut: "",
    slippage: 0.01,
    exactInput: true
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
    const swapContext = useContext(SwapContext)
    const metamaskContext = useContext(MetamaskContext)

    console.log(swapContext?.swapState)

    const dispatch: AppDispatch = useDispatch()

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const account = useSelector((state: RootState) => state.blockchain.account)

    if (swapContext == null) return
    const { swapState, handlers } = swapContext

    if (metamaskContext == null) return
    const { web3State } = metamaskContext
    const { web3 } = web3State

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                amountIn: Yup.number()
                    .typeError("Input must be a number")
                    .min(0, "Input must be greater than or equal to 0")
                    .max(
                        swapState.tokenInInfo.balance,
                        "Input cannot exceed available balance"
                    )
                    .required("This field is required"),
                amountOut: Yup.number()
                    .typeError("Input must be a number")
                    .min(0, "Input must be greater than or equal to 0")
                    .max(
                        swapState.tokenOutInfo.balance,
                        "Input cannot exceed available balance"
                    )
                    .required("This field is required"),
            })}
            onSubmit={async (values) => {
                if (web3 == null || !account) return

                const tokenInContract = new ERC20Contract(
                    chainId,
                    swapState.tokenInInfo.address,
                    web3,
                    account
                )

                const factory = chainInfos[chainId].factory
                const allowanceIn = await tokenInContract.allowance(account, factory)

                if (allowanceIn == null) return

                const parsedAmountIn = computeDeRedenomination(
                    parseNumber(values.amountIn),
                    swapState.tokenInInfo.decimals
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

                const routerContract = new RouterContract(chainId, web3, account)
                const _encodeData = async (
                    pools: Address[]
                ): Promise<Call[] | null> => {
                    const data: Call[] = []
                    let amountIn = parsedAmountIn

                    for (const pool of pools) {
                        const poolContract = new PoolContract(chainId, pool, web3, account)
                        const token0 = await poolContract.token0()
                        const zeroForOne = token0 == swapState.tokenInInfo.address

                        const amountOut = await poolContract.getAmountOut(
                            parsedAmountIn,
                            zeroForOne
                        )
                        if (amountOut == null) return null

                        const encoding = poolContract.encodeSwap(
                            parsedAmountIn,
                            BigInt(0),
                            zeroForOne,
                            BigInt(Date.now()) / BigInt(1000)
                        )

                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        amountIn = amountOut
                        data.push({
                            target: pool,
                            encoding
                        })
                    }
                    return data
                }

                const data = await _encodeData([
                    "0xB0b003476e9BaaE679c5B41D002bfe77b3aBe855"
                ])
                if (data == null) return

                console.log(data)
                
                const multicallReceipt = await routerContract.multicall2(data)

                if (!multicallReceipt) {
                    dispatch(setWaitSignModalShow(false))
                    return
                }

                dispatch(setWaitSignModalShow(false))
                notify(multicallReceipt.transactionHash.toString())

                await handlers.handleWithoutConnected()
                await handlers.handleWithConnected()
            }}
        >
            {(_props) => _renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders
