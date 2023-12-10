import {
    GAS_LIMIT,
    GAS_PRICE,
    chains,
    ChainId
} from "@config"

import { getHttpWeb3 } from "../provider"

import Web3, { Address } from "web3"
import abi from "./abi"

const getFactoryContract = (web3: Web3, chainId: ChainId) => {
    const factoryAddress = chains[chainId].factoryAddress
    return new web3.eth.Contract(abi, factoryAddress, web3)
}

class FactoryCountract {
    private chainId: ChainId
    private factoryAddress: Address
    private web3?: Web3
    private sender?: Address

    constructor(chainId: ChainId, web3?: Web3, sender?: Address) {
        this.chainId = chainId
        this.factoryAddress = chains[this.chainId].factoryAddress
        this.sender = sender
        this.web3 = web3
    }

    async createPool(
        _token0: Address,
        _token1: Address,
        _protocolFee: number,
        _token0AddedAmount: bigint,
        _token1AddedAmount: bigint,
        _token0BasePrice: bigint,
        _token0MaxPrice: bigint
    ) {
        try {
            if (!this.web3) return

            const contract = getFactoryContract(this.web3, this.chainId)
            const data = contract.methods
                .createPool(
                    _token0,
                    _token1,
                    2500,
                    _token0AddedAmount,
                    _token1AddedAmount,
                    _token0BasePrice,
                    _token0MaxPrice,
                )
                .encodeABI()

            return await this.web3.eth.sendTransaction({
                from: this.sender,
                to: this.factoryAddress,
                data,
                gasLimit: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async getPools(){
        try{
            const web3 = getHttpWeb3(this.chainId)
            const contract = getFactoryContract(web3, this.chainId)
            return contract.methods.getPools().call<Address[]>()
        } catch(ex){
            console.log(ex)
            return null
        }
    }
}

export default FactoryCountract
