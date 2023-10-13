import { Formik, FormikProps } from "formik"
import React, { ReactNode, createContext } from "react"
import { Address } from "web3"
import * as Yup from "yup"
import { ERC20Contract, FactoryContract, chainInfos } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { calculateIRedenomination, parseNumber } from "@utils"

interface FormikValues {
  token0Address: Address;
  token1Address: Address;
  _token0Symbol: string;
  _token1Symbol: string;
  _isToken0Sell: boolean;
  token0AddedAmount: string;
  token1AddedAmount: string;
  _token0Balance: number;
  _token1Balance: number;
  _token0Decimals: number;
  _token1Decimals: number;
  token0BasePrice: string;
  token0MaxPrice: string;
  _protocolFeeId: number;
  protocolFee: number;
}

const initialValues: FormikValues = {
    token0Address: "",
    token1Address: "",
    _token0Symbol: "",
    _token1Symbol: "",
    _isToken0Sell: true,
    token0AddedAmount: "",
    token1AddedAmount: "",
    _token0Balance: 0,
    _token1Balance: 0,
    _token0Decimals: 0,
    _token1Decimals: 0,
    token0BasePrice: "",
    token0MaxPrice: "",
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
    const chainName = useSelector((state: RootState) => state.blockchain.chainName)
    const account = useSelector((state: RootState) => state.blockchain.account)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                token0: Yup.string().required("This field is required"),
                token1: Yup.string().required("This field is required"),
                isToken0Sell: Yup.boolean(),
                token0AddedAmount: Yup.number()
                    .max(
                        Yup.ref("_token0Balance"),
                        "Input must not exceed your available balance"
                    ),
                token1AddedAmount: Yup.number()    
                    .max(
                        Yup.ref("_token1Balance"),
                        "Input must not exceed your available balance"
                    ),
                token0BasePrice: Yup.number()
                    .max(
                        Yup.ref("token0MaxPrice"),
                        "Min price must be less than or equal to max price"
                    )
            })}
            onSubmit={async (values) => {
                const token0Contract = new ERC20Contract(chainName, values.token0Address)
                const token1Contract = new ERC20Contract(chainName, values.token1Address)
                
                const factoryAddress = chainInfos[chainName].factoryAddress
                const factoryContract = new FactoryContract(chainName, account)
                
                const token0AddedAmountParsed = parseNumber(values.token0AddedAmount)
                const token1AddedAmountParsed = parseNumber(values.token1AddedAmount)

                const token0BasePriceParsed = parseNumber(values.token0BasePrice)
                const token0MaxPriceParsed = parseNumber(values.token0MaxPrice)

                const token0Allowance = await token0Contract.allowance(account, factoryAddress)
                if (token0Allowance == null) return

                if (token0Allowance < token0AddedAmountParsed){
                    const token0ApproveReceipt = await token0Contract.approve(
                        factoryAddress,
                        token0AddedAmountParsed - token0Allowance
                    ) 
                    if (!token0ApproveReceipt) return
                }

                if (token0Allowance < token0AddedAmountParsed){
                    const token1ApproveReceipt = await token1Contract.approve(
                        factoryAddress,
                        token0AddedAmountParsed - token0Allowance
                    ) 
                    if (!token1ApproveReceipt) return
                }

                const _token0Address = values._isToken0Sell ? values.token0Address : values.token1Address
                const _token1Address = values._isToken0Sell ? values.token1Address : values.token0Address
                
                const _token0Decimals = values._isToken0Sell ? values._token0Decimals : values._token1Decimals
                const _token1Decimals = values._isToken0Sell ? values._token1Decimals : values._token0Decimals

                
                const _token0AddedAmount = values._isToken0Sell ? token0AddedAmountParsed : token1AddedAmountParsed
                const _token1AddedAmount = values._isToken0Sell ? token1AddedAmountParsed : token0AddedAmountParsed

                const createPoolReceipt = await factoryContract.createPool(
                    _token0Address,
                    _token1Address,
                    calculateIRedenomination(_token0AddedAmount, _token0Decimals),
                    calculateIRedenomination(_token1AddedAmount, _token1Decimals),
                    calculateIRedenomination(token0BasePriceParsed, _token0Decimals), 
                    calculateIRedenomination(token0MaxPriceParsed, _token0Decimals),
                    values.protocolFee
                )
                console.log(createPoolReceipt)
            }}
        >
            {(props) => _renderBody(props, children)}
        </Formik>
    )
}

export default FormikProviders
