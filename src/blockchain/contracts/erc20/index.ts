import { ChainId, GAS_LIMIT, GAS_PRICE } from "@config"
import { getHttpWeb3 } from "../../providers/public-node.provider"
import Web3, { Address } from "web3"
import abi from "./abi"

const getERC20Contract = (web3: Web3, address: Address) =>
    new web3.eth.Contract(abi, address, web3)

class ERC20Contract {
    private chainId: ChainId
    private address: Address
    private web3?: Web3
    private sender?: Address

    constructor(
        chainId: ChainId,
        address: Address,
        web3?: Web3,
        sender?: string
    ) {
        this.chainId = chainId
        this.address = address
        this.web3 = web3
        this.sender = sender
    }

    async name() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getERC20Contract(web3, this.address)
            return await contract.methods.name().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async symbol(controller?: AbortController) {
        try {
            const web3 = getHttpWeb3(this.chainId, controller)
            const contract = getERC20Contract(web3, this.address)
            return await contract.methods.symbol().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async decimals() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getERC20Contract(web3, this.address)
            return Number(await contract.methods.decimals().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async balanceOf(owner: Address) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getERC20Contract(web3, this.address)
            return await contract.methods.balanceOf(owner).call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async allowance(owner: Address, spender: Address) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getERC20Contract(web3, this.address)
            return await contract.methods.allowance(owner, spender).call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async approve(spender: string, value: bigint) {
        try {
            if (!this.web3) return null
            const contract = getERC20Contract(this.web3, this.address)
            return contract.methods.approve(spender, value).send({
                from: this.sender,
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}

export default ERC20Contract
