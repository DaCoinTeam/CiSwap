import { GAS_LIMIT, GAS_PRICE, ChainId } from "@config"

import { getHttpWeb3 } from "../provider"

import Web3, { Address } from "web3"
import abi from "./abi"

const getFactoryContract = (web3: Web3, address: Address) => {
    return new web3.eth.Contract(abi, address, web3)
}

class FactoryCountract {
    private chainId: ChainId
    private address: Address
    private web3?: Web3
    private sender?: Address

    constructor(
        chainId: ChainId,
        address: Address,
        web3?: Web3,
        sender?: Address
    ) {
        this.chainId = chainId
        this.address = address
        this.sender = sender
        this.web3 = web3
    }

    async createPool(params: {
    fee: number;
    config: {
      tokenA: string;
      tokenB: string;
      amountA: bigint;
      amountB: bigint;
      basePriceAX96: bigint;
      maxPriceAX96: bigint;
    };
  }) {
        try {
            if (!this.web3) return
            const contract = getFactoryContract(this.web3, this.address)
            return contract.methods.createPool(params).send({
                from: this.sender,
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async allPools() {
        try {
            const web3 = getHttpWeb3(this.chainId)
            const contract = getFactoryContract(web3, this.address)
            return contract.methods.allPools().call<Address[]>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}

export default FactoryCountract
