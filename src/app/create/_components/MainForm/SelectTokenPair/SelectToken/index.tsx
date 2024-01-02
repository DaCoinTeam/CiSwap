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
import { TIME_OUT } from "@config"
import { Address } from "web3"
import { AppButton, LoadingDisplay } from "@app/_shared"
import { FormikContext } from "../../FormikContext"
import { FinishSelectedPairContext } from "../../index"

interface SelectTokenProps {
  className?: string;
  otherToken: Address;
  isTokenBSelected?: boolean;
}

const SelectToken = (props: SelectTokenProps) => {
    const formik = useContext(FormikContext)
    if (formik === null) return

    const finishSelectedPairContext = useContext(FinishSelectedPairContext)
    if (finishSelectedPairContext === null) return

    const { setFinishSelectedPair } = finishSelectedPairContext

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const account = useSelector((state: RootState) => state.blockchain.account)

    console.log(formik.values)

    const [isOpen, setIsOpen] = useState(false)

    const _open = () => setIsOpen(true)
    const _close = () => {
        setIsOpen(false)
        setTempToken("")
        setError(ErrorType.Undefined)
    }
    const [tempToken, setTempToken] = useState("")
    const [tempSymbol, setTempSymbol] = useState("")

    const [symbol, setTokenSymbol] = useState("")

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

      if (!tempToken) return

      const controller = new AbortController()
      const handleEffect = async () => {
          const contract = new ERC20Contract(chainId, tempToken)
          const symbol = await contract.symbol(controller)

          setFinishFetch(true)
          if (symbol === null) {
              setError(ErrorType.InvalidTokenAddress)
              return
          }
          if (tempToken === props.otherToken) {
              setError(ErrorType.Duplicated)
              return
          }
          setTempSymbol(symbol)
          setError(ErrorType.None)
      }

      const delayedEffectWithBounce = setTimeout(() => handleEffect(), TIME_OUT)

      return () => {
          controller.abort()
          clearTimeout(delayedEffectWithBounce)
      }
  }, [tempToken])

  const onChangeTempToken = (event: ChangeEvent<HTMLInputElement>) => {
      const _token = event.target.value

      setTempToken(_token)

      if (!_token) {
          setError(ErrorType.Required)
          return
      }
      setFinishFetch(false)
  }

  const _invalid =
    error != ErrorType.Undefined && error != ErrorType.None && finishFetch
  const _message = _invalid && finishFetch ? error : ""

  const onClickSelectStableToken = (token: Address) => {
      if (tempToken === token) return
      setTempToken(token)
      setFinishFetch(false)
  }

  const onClickImport = (token: Address, symbol: Address) => {
      setTokenSymbol(symbol)
      setIsOpen(false)

      const _token = props.isTokenBSelected ? "tokenB" : "tokenA"
      formik.setFieldValue(_token, token)
      const _symbol = props.isTokenBSelected ? "_symbolB" : "_symbolA"
      formik.setFieldValue(_symbol, symbol)
  }

  const tokenA = formik.values.tokenA
  const tokenB = formik.values.tokenB
  useEffect(() => {
      const value = account && tokenA && tokenB
      setFinishSelectedPair(!!value)
  }, [account, tokenA, tokenB])

  return (
      <>
          <Button className={`${props.className}`} variant="flat" onPress={_open}>
              {symbol || "Select Token"}
          </Button>
          <Modal isOpen={isOpen} onClose={_close}>
              <ModalContent>
                  <ModalHeader className="p-5">Select Token</ModalHeader>
                  <Divider />
                  <ModalBody className="p-5 gap-6">
                      <div>
                          <Input
                              onChange={onChangeTempToken}
                              label="Token Address"
                              value={tempToken}
                              isInvalid={_invalid}
                              errorMessage={_message}
                          />
                          <LoadingDisplay finishLoad={finishFetch} message="Checking" />
                      </div>
                      <SelectStableToken callback={onClickSelectStableToken} />
                  </ModalBody>
                  <ModalFooter className="p-5">
                      {error === ErrorType.None ? (
                          <div className="mx-auto flex gap-4 items-center">
                              <Link
                                  color="foreground"
                                  showAnchorIcon
                                  isBlock
                                  className="text-lg font-bold"
                              >
                                  {tempSymbol}
                              </Link>
                              <AppButton
                                  size="lg"
                                  onClick={() => onClickImport(tempToken, tempSymbol)}
                                  text="Import"
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
