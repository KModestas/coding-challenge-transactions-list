import { takeEvery } from "redux-saga/effects";
import {
  JsonRpcProvider,
  Transaction,
  TransactionResponse,
  TransactionReceipt,
  BrowserProvider,
  Signer,
  parseEther
} from "ethers";

import apolloClient from "../apollo/client";
import { Actions, SaveTransactionData, Action, SendTransactionPayload } from "../types";
import { SaveTransaction } from "../queries";
import { navigate } from "../components/NaiveRouter";

function* sendTransaction(payload: Action<SendTransactionPayload>) {
  const provider = new JsonRpcProvider("http://localhost:8545");

  const walletProvider = new BrowserProvider(window.web3.currentProvider);

  const signer: Signer = yield walletProvider.getSigner();

  const accounts: Array<{ address: string }> = yield provider.listAccounts();

  const randomAddress = () => {
    const min = 1;
    const max = 19;
    const random = Math.round(Math.random() * (max - min) + min);
    return accounts[random].address;
  };

  const transaction = {
    to: randomAddress(),
    // #3 - The value of a transaction should be denoted in Wei, however numbers such as 1000000000000000000 are too large and will cause an overflow error. Use ethers.js utilities to specify the Eth value which will safetly convert it to Wei.
    value: parseEther("1.0"),
  };

  try {
    const txResponse: TransactionResponse =
      yield signer.sendTransaction(transaction);
    const response: TransactionReceipt = yield txResponse.wait();

    const receipt: Transaction = yield response.getTransaction();

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit && receipt.gasLimit.toString()) || "0",
        gasPrice: (receipt.gasPrice && receipt.gasPrice.toString()) || "0",
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value && receipt.value.toString()) || "",
        data: receipt.data || null,
        chainId: (receipt.chainId && receipt.chainId.toString()) || "123456",
        hash: receipt.hash,
      },
    };

    // #4 - Get the resulting hash returned from our GraphQl mutation and use it to programatically navigate to the new transaction's page 
    const gqlResponse: SaveTransactionData = yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables,
    });

    const hash = gqlResponse.data.addTransaction.hash
    navigate(`/transaction/${hash}`);
  } catch (error) {
    console.log('sendTransaction Error: ', error)
  }
}

export function* rootSaga() {
  yield takeEvery(Actions.SendTransaction, sendTransaction);
}
