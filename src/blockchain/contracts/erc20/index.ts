import { ChainName, GAS_LIMIT, GAS_PRICE } from "../../config"
import { getHttpWeb3 } from "../provider"
import Web3, { Address } from "web3"
import abi from "./abi"

const getERC20Contract = (web3: Web3, ERC20Address: Address) =>
    new web3.eth.Contract(abi, ERC20Address, web3)

class ERC20Countract {
    private chainName: ChainName
    private ERC20Address: Address
    private web3?: Web3
    private sender?: Address

    constructor(chainName: ChainName, ERC20Address: Address, web3?: Web3, sender?: string) {
        this.chainName = chainName
        this.ERC20Address = ERC20Address
        this.web3 = web3
        this.sender = sender
    }

    async name() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getERC20Contract(web3, this.ERC20Address)
            return await contract.methods.name().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async symbol(controller?: AbortController) {
        try {
            const web3 = getHttpWeb3(this.chainName, controller)
            const contract = getERC20Contract(web3, this.ERC20Address)
            return await contract.methods.symbol().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async decimals() {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getERC20Contract(web3, this.ERC20Address)
            return Number(await contract.methods.decimals().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async balanceOf(_owner: Address) {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getERC20Contract(web3, this.ERC20Address)
            return BigInt((await contract.methods.balanceOf(_owner).call()).toString())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async allowance(_owner: Address, spender: Address){
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getERC20Contract(web3, this.ERC20Address)
            return BigInt((await contract.methods.allowance(_owner, spender).call()).toString())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async approve(_spender: string, _value: bigint){
        try{
            if (!this.web3) return null
            const contract = getERC20Contract(this.web3, this.ERC20Address)
            const data = contract.methods.approve(_spender, _value).encodeABI()
            
            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.ERC20Address,
                data,
                gasLimit: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch(ex){
            console.log(ex)
            return null
        }
    }
}

export default ERC20Countract
