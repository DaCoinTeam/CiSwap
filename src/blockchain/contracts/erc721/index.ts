import { ChainId, GAS_LIMIT, GAS_PRICE } from "@config"
import { getHttpWeb3 } from "../provider"
import Web3, { Address } from "web3"
import abi from "./abi"

const getERC720Contract = (web3: Web3, ERC721Address: Address) =>
    new web3.eth.Contract(abi, ERC721Address, web3)

class ERC721Contract {
    private chainId: ChainId
    private ERC721Address: Address
    private web3?: Web3
    private sender?: Address

    constructor(chainId: ChainId, ERC721Address: Address, web3?: Web3, sender?: string) {
        this.chainId = chainId
        this.ERC721Address = ERC721Address
        this.web3 = web3
        this.sender = sender
    }

    async name() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getERC720Contract(web3, this.ERC721Address)
            return await contract.methods.name().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async symbol(controller?: AbortController) {
        try {
            const web3 = getHttpWeb3(this.chainId, controller)
            const contract = getERC720Contract(web3, this.ERC721Address)
            return await contract.methods.symbol().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async decimals() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getERC720Contract(web3, this.ERC721Address)
            return Number(await contract.methods.decimals().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async balanceOf(_owner: Address) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getERC720Contract(web3, this.ERC721Address)
            return BigInt((await contract.methods.balanceOf(_owner).call()).toString())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async numNFTs() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getERC720Contract(web3, this.ERC721Address)
            return BigInt((await contract.methods.numNFTs().call()).toString())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async tokenURI(tokenId: bigint) {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getERC720Contract(web3, this.ERC721Address)
            return await contract.methods.tokenURI(tokenId).call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async approve(_spender: string, _value: bigint){
        try{
            if (!this.web3) return null
            const contract = getERC720Contract(this.web3, this.ERC721Address)
            const data = contract.methods.approve(_spender, _value).encodeABI()
            
            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.ERC721Address,
                data,
                gasLimit: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch(ex){
            console.log(ex)
            return null
        }
    }

    async safeMint(account: Address, URI: string){
        try{
            if (!this.web3) return null
            const contract = getERC720Contract(this.web3, this.ERC721Address)
            const data = contract.methods.safeMint(account, URI).encodeABI()
            
            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.ERC721Address,
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

export default ERC721Contract
