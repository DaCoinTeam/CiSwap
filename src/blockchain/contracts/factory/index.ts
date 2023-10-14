import {
    GAS_LIMIT,
    GAS_PRICE,
    chainInfos,
} from "../../config"
import { ChainName } from "../../config"
import { getHttpWeb3 } from "../provider"

import Web3, { Address } from "web3"
import abi from "./abi"

const getFactoryContract = (web3: Web3) => {
    const factoryAddress = chainInfos[ChainName.KalytnTestnet].factoryAddress
    return new web3.eth.Contract(abi, factoryAddress, web3)
}

class FactoryCountract {
    private chainName: ChainName
    private factoryAddress: Address
    private web3?: Web3
    private sender?: Address

    constructor(chainName: ChainName, web3?: Web3, sender?: Address) {
        this.chainName = chainName
        this.factoryAddress = chainInfos[this.chainName].factoryAddress
        this.sender = sender
        this.web3 = web3
    }

    async createPool(
        _token0: Address,
        _token1: Address,
        _token0AddedAmount: bigint,
        _token1AddedAmount: bigint,
        _token0BasePrice: bigint,
        _token0MaxPrice: bigint,
        _protocolFee: number
    ) {
        try {
            if (!this.web3) return

            const contract = getFactoryContract(this.web3)
            const data = contract.methods
                .createPool(
                    _token0,
                    _token1,
                    _token0AddedAmount,
                    _token1AddedAmount,
                    _token0BasePrice,
                    _token0MaxPrice,
                    _protocolFee
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

    async getPairs(_token0: Address, _token1: Address) {
        try {
            const web3 = getHttpWeb3(this.chainName)
            const contract = getFactoryContract(web3)
            return contract.methods.getPair(_token0, _token1).call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async getAll(){
        try{
            const web3 = getHttpWeb3(this.chainName)
            const contract = getFactoryContract(web3)
            return contract.methods.getAll().call()
        } catch(ex){
            console.log(ex)
            return null
        }
    }
}

export default FactoryCountract
