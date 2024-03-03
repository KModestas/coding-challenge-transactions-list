declare global {
  interface Window {
    web3: any;
  }
}

export interface Transaction {
  gasLimit: string;
  gasPrice: string;
  to: string;
  from: string;
  value: string;
  data?: string;
  chainId: string;
  hash: string;
}

export interface TransactionsData {
  getAllTransactions: Transaction[];
}

export interface SingleTransactionData {
  getTransaction: Transaction;
}

export interface SaveTransactionData {
  data: {
    addTransaction: Transaction
  }
}

export interface SendTransactionPayload {
  recipient: string;
  amount: number;
}

export type Action<P> = {
  type: Actions;
  payload: P;
};

export enum Actions {
  SendTransaction = "SEND_TRANSACTION",
  SendTransactionSuccess = 'SEND_TRANSACTION_SUCCESS',
  SendTransactionFail = 'SEND_TRANSACTION_FAIL',
  SendTransactionLoading = 'SEND_TRANSACTION_LOADING',
}

export enum Status {
  loading = 'loading',
  fail = 'fail',
  success = 'success',
}

export type TransactionStatus = Status.loading | Status.fail | Status.success | null

export interface RootState {
  transactions: any[];
  transactionStatus: TransactionStatus;
}
