import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext } from "react"
import * as Yup from "yup"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { ERC20Contract, ERC721Contract } from "@blockchain"
import { chainInfos } from "@config"
import { pinataPOSTFile, pinataPOSTJson } from "@api"
import { Address } from "web3"
import { ContextProps } from "@app/_shared"
import { MetamaskContext } from "@app/_hooks"

interface FormikValues {
    name: string,
    collection: string,
    floor: string,
    description: string,
    imageFile: File | null,
    _tagInput: string,
    tags: string[],
    externalUrl: string
}

const initialValues: FormikValues = {
    name: "",
    collection: "",
    floor: "",
    description: "",
    imageFile: null,
    _tagInput: "",
    tags: [],
    externalUrl: ""
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

const FormikProviders = (props: ContextProps) => {
    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext == null) return 
    const { web3State } = metamaskContext
    const { web3 } = web3State
    
    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const account = useSelector((state: RootState) => state.blockchain.account)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                name: Yup.string().required("Name is required"),
                collection: Yup.string().required("Collection is required"),
                description: Yup.string().required("Description is required"),
                imageFile: Yup.mixed().test("Image is required", (value) => {
                    return value !== null
                }),
                tags: Yup.array().required(),
                externalUrl: Yup.string().required("External URL is required")
            })}
            onSubmit={
                async (values) => {
                    if (web3 == null) return
                    
                    const erc20Contract = new ERC20Contract(chainId, chainInfos[chainId].exchangeToken)

                    const decimals = await erc20Contract.decimals()
                    if (decimals == null) return

                    const file = values.imageFile
                    
                    if (file == null) return
                    const addFileResponse = await pinataPOSTFile(file)

                    const imageCid = addFileResponse?.IpfsHash
                    if (!imageCid || imageCid == null) return 

                    const NFTAddress = chainInfos[chainId].NFTAddress
                    const erc721Contract = new ERC721Contract(
                        chainId,
                        NFTAddress,
                        web3,
                        account
                    )

                    const uri : NFTURI = {
                        name: values.name,
                        author: account,
                        collection: values.collection,
                        floor: Number(values.floor),
                        description: values.description,
                        externalUrl: values.externalUrl,
                        tags: values.tags,
                        imageCid
                    }

                    const addJsonResponse = await pinataPOSTJson(uri)
                    const uriHash = addJsonResponse?.IpfsHash
                    if (!uriHash || uriHash == null) return 

                    const receipt = await erc721Contract.safeMint(account, uriHash)
                    console.log(receipt)
                }}
        >
            {(_props) => _renderBody(_props, props.children)}
        </Formik>
    )
}

export default FormikProviders

export interface NFTURI {
    name: string;
    author: Address;
    floor: number;
    collection: string;
    description: string;
    externalUrl: string;
    tags: string[]
    imageCid: string
  }
  