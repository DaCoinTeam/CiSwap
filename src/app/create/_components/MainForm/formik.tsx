import { Formik, FormikProps } from "formik"
import React, { ReactNode, createContext } from "react"
import { Address } from "web3"
import * as Yup from "yup"

interface FormikValues {
  token0Address: Address;
  token1Address: Address;
  _token0Symbol: string;
  _token1Symbol: string;
  _isToken0Sell: boolean;
  token0AddedAmount: number;
  token1AddedAmount: number;
  _token0Balance: number;
  _token1Balance: number;
  token0BasePrice: number;
  token0MaxPrice: number;
  _protocolFeeId: number;
  protocolFee: number;
}

const initialValues: FormikValues = {
    token0Address: "",
    token1Address: "",
    _token0Symbol: "",
    _token1Symbol: "",
    _isToken0Sell: true,
    token0AddedAmount: 0,
    token1AddedAmount: 0,
    _token0Balance: 0,
    _token1Balance: 0,
    token0BasePrice: 0,
    token0MaxPrice: 0,
    _protocolFeeId: 0,
    protocolFee: 0.0025
}

export const FormikPropsContext =
  createContext<FormikProps<FormikValues> | null>(null)

const _renderBody = (
    props: FormikProps<FormikValues> | null,
    chidren: ReactNode
) => (
    <FormikPropsContext.Provider value={props}>
        {chidren}
    </FormikPropsContext.Provider>
)

const FormikProviders = ({ children }: { children: ReactNode }) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                token0: Yup.string().required("This field is required"),
                token1: Yup.string().required("This field is required"),
                isToken0Sell: Yup.boolean(),
                token0AddedAmount: Yup.number()
                    .typeError("Input must be a number")
                    .typeError("")
                    .min(0, "Input must be greater than or equal to 0")
                    .max(
                        Yup.ref("_token0Balance"),
                        "Input must not exceed your available balance"
                    )
                    .required("This field is required"),
                token1DepositAmount: Yup.number()
                    .typeError("Input must be a number")
                    .min(0, "Input must be greater than or equal to 0")
                    .max(
                        Yup.ref("_token1Balance"),
                        "Input must not exceed your available balance"
                    )
                    .required("This field is required"),
                token0BasePrice: Yup.number()
                    .typeError("Input must be a number")
                    .min(0, "Input must be greater than or equal to 0")
                    .required("This field is required")
                    .max(
                        Yup.ref("token0MaxPrice"),
                        "Min price must be less than or equal to max price"
                    ),
                token0MaxPrice: Yup.number()
                    .typeError("Input must be a number")
                    .min(
                        Yup.ref("token0BasePrice"),
                        "Max price must be greater than or equal to min price"
                    )
                    .required("This field is required"),
                protocolFee: Yup.number()
                    .typeError("Input must be a number")
                    .min(0, "Input must be greater than or equal to 0")
                    .required("This field is required"),
            })}
            onSubmit={(values, actions) => {
                console.log(values)
                console.log(actions)
            }}
        >
            {(props) => _renderBody(props, children)}
        </Formik>
    )
}

export default FormikProviders
