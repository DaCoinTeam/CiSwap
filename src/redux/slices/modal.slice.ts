import { createSlice } from "@reduxjs/toolkit"
import { Address } from "web3"

export interface ModalSlice {
  signatureConfirmationModal: SignatureConfirmationModal;
}

const initialState: ModalSlice = {
    signatureConfirmationModal: false,
}

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setSignatureConfirmationModalInfo(state, action: { payload: TransactionInfo }) {
            state.signatureConfirmationModal = action.payload
        },
        setSignatureConfirmationModalToClosed(state) {
            state.signatureConfirmationModal = false
        },
    },
})

export const {
    setSignatureConfirmationModalInfo,
    setSignatureConfirmationModalToClosed,
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
