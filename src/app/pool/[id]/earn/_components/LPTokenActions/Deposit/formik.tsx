import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext } from "react"
import { Address } from "web3"
import * as Yup from "yup"
import { ERC20Contract, FactoryContract, chainInfos } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { TokenState } from "@app/pool/[id]/_definitions"

interface FormikValues {
    token1DepositAmount: string;
    LPTokenAmountOut: number;
    slippage: number;
}

const initialValues: FormikValues = {
    token1DepositAmount: "",
    LPTokenAmountOut: 0,
    slippage : 0.01
}

export const FormikPropsContext =
  createContext<FormikProps<FormikValues> | null>(null)

const _renderBody = (
    props: FormikProps<FormikValues> | null,
    chidren: ReactNode
) => (
    <FormikPropsContext.Provider value={props}>
        <Form onSubmit={props?.handleSubmit}>
            {chidren}
        </Form>
    </FormikPropsContext.Provider>
)

interface FormikProvidersProps {
    children: ReactNode;
    tokenState: TokenState;
}

const FormikProviders = ({ children, tokenState }: FormikProvidersProps) => {
    const chainName = useSelector((state: RootState) => state.blockchain.chainName)
    const web3 = useSelector((state: RootState) => state.blockchain.web3)

    const account = useSelector((state: RootState) => state.blockchain.account)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                token1DepositAmount: Yup.number()    
                    .max(
                        tokenState.token1Balance,
                        "Input must not exceed your available balance"
                    )
            })}
            onSubmit={
                async (values) => {
                    if (web3 == null) return

                    const token0Contract = new ERC20Contract(chainName, tokenState.token0Address, web3, account)
                    const token1Contract = new ERC20Contract(chainName, tokenState.token1Address, web3, account)
                
                    const factoryAddress = chainInfos[chainName].factoryAddress
                    const factoryContract = new FactoryContract(chainName, web3, account)
                }}
        >
            {(props) => _renderBody(props, children)}
        </Formik>
    )
}

export default FormikProviders
