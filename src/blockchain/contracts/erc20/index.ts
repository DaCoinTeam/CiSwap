import { ChainName } from "../../config"
import { getHttpWeb3 } from "../provider"
import Web3, { Address } from "web3"
import abi from "./abi"

const getERC20Contract = (web3: Web3, ERC20Address: Address) =>
    new web3.eth.Contract(abi, ERC20Address, web3)

class ERC20Countract {
    private chainName: ChainName
    private ERC20Address: Address
    private web3?: Web3

    constructor(chainName: ChainName, ERC20Address: Address, web3?: Web3) {
        (this.chainName = chainName),
        (this.ERC20Address = ERC20Address),
        (this.web3 = web3)
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

    async symbol() {
        try {
            const web3 = getHttpWeb3(this.chainName)
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
}

export default ERC20Countract
