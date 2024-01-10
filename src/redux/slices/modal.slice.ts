import { createSlice } from "@reduxjs/toolkit"
import { Address } from "web3"
import { ChainId } from "@config"

export interface ModalSlice {
  signatureConfirmationModal: SignatureConfirmationModal;
  metamaskWrongChainModal: MetamaskWrongChainModal;
}

const initialState: ModalSlice = {
    signatureConfirmationModal: false,
    metamaskWrongChainModal: false,
}

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setSignatureConfirmationModal(
            state,
            action: { payload: false | TransactionInfo }
        ) {
            state.signatureConfirmationModal = action.payload
        },
        setMetamaskWrongChainModal(state, action: { payload: false | ChainId }) {
            state.metamaskWrongChainModal = action.payload
        },
    },
})

export const {
    setSignatureConfirmationModal,
    setMetamaskWrongChainModal,
} = modalSlice.actions

export const modalReducer = modalSlice.reducer

export type SignatureConfirmationModal = false | TransactionInfo;

export enum TransactionType {
  Approve,
  Swap,
  CreatePool,
  AddLiquidity,
  RemoveLiquidity,
}

interface ApproveInfo {
  type: TransactionType.Approve;
  token: {
    address: Address;
    amount: number;
  };
}

interface SwapInfo {
  type: TransactionType.Swap;
  tokenIn: {
    address: Address;
    amount: number;
  };
  tokenOut: {
    address: Address;
    amount: number;
  };
}

export type TransactionInfo = ApproveInfo | SwapInfo;

export type MetamaskWrongChainModal = false | ChainId;
