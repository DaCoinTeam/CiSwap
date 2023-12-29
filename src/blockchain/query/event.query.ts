import { HexString } from "web3"
import { EventLog } from "web3-eth-contract"
import { chainId } from "@config"
import { getHttpWeb3 } from "../contracts"
import { computeRedenomination } from "@utils"

export interface RewardLog {
  transactionHash: HexString;
  LPTokenAward: string;
  timestamp: Date;
}

export const getRewardLog = async (
    event: EventLog,
    chainId: chainId,
    LPTokenDecimals: number,
    LPTokenSymbol: string
) => {
    const web3 = getHttpWeb3(chainId)

    const transactionHash = event.transactionHash as string

    const block = await web3.eth.getBlock(event.blockNumber)

    const timestamp = new Date(Number(block.timestamp) * 1000)  

    const LPTokenAwardAmount = computeRedenomination(
    web3.eth.abi.decodeParameter("uint256", event.data) as bigint,
    LPTokenDecimals,
    3
    )

    const LPTokenAward = `${LPTokenAwardAmount} ${LPTokenSymbol}`

    return {
        transactionHash,
        LPTokenAward,
        timestamp
    }
}
