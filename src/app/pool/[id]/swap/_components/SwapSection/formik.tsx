import { Formik } from "formik"
import React, { ReactNode } from "react"
import * as Yup from "yup"

interface FormikValues {
  token0Amount: number;
  token1Amount: number;
  _token0Balance: number;
  _token1Balance: number;
  slippage: number;
  _isBuyAction: boolean;
}

const initialValues: FormikValues = {
    token0Amount: 0,
    token1Amount: 0,
    _token0Balance: 0,
    _token1Balance: 0,
    slippage: 0.01,
    _isBuyAction: false,
}

const FormikProviders = ({ children }: { children: ReactNode }) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                token0Amount: Yup.number()
                    .typeError("Input must be a number")
                    .min(0, "Input must be greater than or equal to 0")
                    .max(
                        Yup.ref("_token0Balance"),
                        "Input cannot exceed available balance"
                    )
                    .required("This field is required"),
                token1Amount: Yup.number()
                    .typeError("Input must be a number")
                    .min(0, "Input must be greater than or equal to 0")
                    .max(
                        Yup.ref("_token1Balance"),
                        "Input cannot exceed available balance"
                    )
                    .required("This field is required"),
            })}
            onSubmit={(values, actions) => {
                console.log(values)
                console.log(actions)
            }}
        >
            {children}
        </Formik>
    )
}

export default FormikProviders
