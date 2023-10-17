"use client"
import {
    Button,
    Divider,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"
import React, {
    ChangeEvent,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import SelectStableToken from "./SelectStableToken"
import { ERC20Contract } from "@blockchain"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { TIME_OUT } from "@app/config"
import { Address } from "web3"
import { AppButton, LoadingDisplay } from "@app/_shared"
import { FormikPropsContext } from "../../formik"
import { FinishSelectPairContext } from "../../index"

interface SelectTokenProps {
  className?: string;
  otherTokenAddress: Address;
  isToken1Select?: boolean;
}

const SelectToken = (props: SelectTokenProps) => {
    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const finishSelectPairContext = useContext(FinishSelectPairContext)
    if (finishSelectPairContext == null) return

    const { setFinishSelectPair } = finishSelectPairContext

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const account = useSelector((state: RootState) => state.blockchain.account)

    console.log(formik.values)

    const [isOpen, setIsOpen] = useState(false)

    const _open = () => setIsOpen(true)
    const _close = () => {
        setIsOpen(false)
        setTempTokenAddress("")
        setError(ErrorType.Undefined)
    }
    const [tempTokenAddress, setTempTokenAddress] = useState("")
    const [tempTokenSymbol, setTempTokenSymbol] = useState("")

    const [tokenSymbol, setTokenSymbol] = useState("")

  enum ErrorType {
    Undefined = "Undefined",
    None = "None",
    Required = "Input is required",
    InvalidTokenAddress = "Input is not a valid token address",
    Duplicated = "Token address cannot be duplicated",
  }

  const [error, setError] = useState<ErrorType>(ErrorType.Undefined)

  const [finishFetch, setFinishFetch] = useState(true)

  const firstRender = useRef(true)
  useEffect(() => {
      if (firstRender.current) {
          firstRender.current = false
          return
      }

      if (!tempTokenAddress) return

      const controller = new AbortController()
      const handleEffect = async () => {
          const contract = new ERC20Contract(chainName, tempTokenAddress)
          const symbol = await contract.symbol(controller)

          setFinishFetch(true)
          if (symbol == null) {
              setError(ErrorType.InvalidTokenAddress)
              return
          }
          if (tempTokenAddress == props.otherTokenAddress) {
              setError(ErrorType.Duplicated)
              return
          }
          setTempTokenSymbol(symbol)
          setError(ErrorType.None)
      }

      const delayedEffectWithBounce = setTimeout(() => handleEffect(), TIME_OUT)

      return () => {
          controller.abort()
          clearTimeout(delayedEffectWithBounce)
      }
  }, [tempTokenAddress])

  const _changeTempTokenAddress = (event: ChangeEvent<HTMLInputElement>) => {
      const _tokenAddress = event.target.value

      setTempTokenAddress(_tokenAddress)

      if (!_tokenAddress) {
          setError(ErrorType.Required)
          return
      }
      setFinishFetch(false)
  }

  const _invalid =
    error != ErrorType.Undefined && error != ErrorType.None && finishFetch
  const _message = _invalid && finishFetch ? error : ""

  const _click = (tokenAddress: Address) => {
      if (tempTokenAddress == tokenAddress) return
      setTempTokenAddress(tokenAddress)
      setFinishFetch(false)
  }

  const _import = (tokenAddress: Address, tokenSymbol: Address) => {
      setTokenSymbol(tokenSymbol)
      setIsOpen(false)

      const _tokenAddress = props.isToken1Select
          ? "token1Address"
          : "token0Address"
      const _tokenSymbol = props.isToken1Select
          ? "_token1Symbol"
          : "_token0Symbol"
      formik.setFieldValue(_tokenAddress, tokenAddress)
      formik.setFieldValue(_tokenSymbol, tokenSymbol)
  }

  const token0Address = formik.values.token0Address
  const token1Address = formik.values.token1Address
  useEffect(() => {
      const value = account && token0Address && token1Address
      setFinishSelectPair(!!value)
  }, [
      account,
      token0Address,
      token1Address
  ])

  return (
      <>
          <Button className={`${props.className}`} variant="flat" onPress={_open}>
              {tokenSymbol || "Select Token"}
          </Button>
          <Modal isOpen={isOpen} onClose={_close}>
              <ModalContent>
                  <ModalHeader className="p-5">Select Token</ModalHeader>
                  <Divider />
                  <ModalBody className="p-5 gap-6">
                      <div>
                          <Input
                              onChange={_changeTempTokenAddress}
                              label="Token Address"
                              value={tempTokenAddress}
                              isInvalid={_invalid}
                              errorMessage={_message}
                          />
                          <LoadingDisplay finishLoad={finishFetch} message="Checking" />
                      </div>
                      <SelectStableToken onClick={_click} />
                  </ModalBody>
                  <ModalFooter className="p-5">
                      {error == ErrorType.None ? (
                          <div className="mx-auto flex gap-4 items-center">
                              <Link
                                  color="foreground"
                                  showAnchorIcon
                                  isBlock
                                  className="text-lg font-bold"
                              >
                                  {tempTokenSymbol}
                              </Link>
                              <AppButton
                                  size="lg"
                                  onPress={() => _import(tempTokenAddress, tempTokenSymbol)}
                                  content="Import"
                              />
                          </div>
                      ) : null}
                  </ModalFooter>
              </ModalContent>
          </Modal>
      </>
  )
}

export default SelectToken
