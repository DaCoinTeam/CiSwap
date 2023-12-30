import { ChainId, GAS_LIMIT, GAS_PRICE } from "@config"
import Web3, { Address, Bytes } from "web3"
import abi from "./abi"
import { getHttpWeb3 } from ".."

const getMulticallContract = (web3: Web3, address: Address) =>
    new web3.eth.Contract(abi, address, web3)

class MulticallContract {
    private chainId: ChainId
    private address: Address
    private sender?: Address
    private web3?: Web3

    constructor(
        chainId: ChainId,
        address: Address,
        web3?: Web3,
        sender?: Address
    ) {
        this.chainId = chainId
        this.address = address
        this.web3 = web3
        this.sender = sender
    }

    multicall(data: Bytes[]) {
        return {
            send: async () => {
                try {
                    if (!this.web3) return

                    const contract = getMulticallContract(this.web3, this.address)
                    const _data = contract.methods.multicall(data).encodeABI()
                    console.log(data)

                    return await this.web3.eth.sendTransaction({
                        from: this.sender,
                        to: this.address,
                        data: _data,
                        gasLimit: GAS_LIMIT,
                        gasPrice: GAS_PRICE,
                    })
                } catch (ex) {
                    console.log(ex)
                    return null
                }
            },
            call: async () => {
                try {
                    const web3 = getHttpWeb3(this.chainId)
                    const contract = getMulticallContract(web3, this.address)
                    return contract.methods.multicall(data).call<Bytes[]>()
                } catch (ex) {
                    console.log(ex)
                    return null
                }
            },
        }
    }

    async multicall2(data: Bytes[]) {
        try {
            if (!this.web3) return

            const contract = getMulticallContract(this.web3, this.address)
            const _data = contract.methods.multicall2(data).encodeABI()
            console.log(data)

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.address,
                data: _data,
                gasLimit: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}
export default MulticallContract
