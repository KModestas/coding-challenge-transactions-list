import { takeEvery, put } from 'redux-saga/effects'
import {
  Transaction,
  TransactionResponse,
  TransactionReceipt,
  BrowserProvider,
  Signer,
  parseEther
} from 'ethers'

import apolloClient from '../apollo/client'
import { Actions, SaveTransactionData, Action, SendTransactionPayload } from '../types'
import { SaveTransaction } from '../queries'
import { navigate } from '../components/NaiveRouter'

function* sendTransaction(data: Action<SendTransactionPayload>) {
  yield put({ type: Actions.SendTransactionLoading })

  const { recipient, amount } = data.payload
  const formattedAmount = Number(amount).toFixed(1)

  const walletProvider = new BrowserProvider(window.web3.currentProvider)

  const signer: Signer = yield walletProvider.getSigner()

  const transaction = {
    to: recipient,
    // #3 - The value of a transaction should be denoted in Wei, however numbers such as "1000000000000000000" are too large and will cause an overflow error in JavaScript. Use ethers.js utility to specify a value in Ether which will safely be converted to Wei.
    value: parseEther(formattedAmount)
  }

  try {
    const txResponse: TransactionResponse = yield signer.sendTransaction(transaction)
    const response: TransactionReceipt = yield txResponse.wait()

    const receipt: Transaction = yield response.getTransaction()

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit && receipt.gasLimit.toString()) || '0',
        gasPrice: (receipt.gasPrice && receipt.gasPrice.toString()) || '0',
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value && receipt.value.toString()) || '',
        data: receipt.data || null,
        chainId: (receipt.chainId && receipt.chainId.toString()) || '123456',
        hash: receipt.hash
      }
    }

    // #4 - Get the resulting hash returned from our GraphQl mutation and use it to programatically navigate to the new transaction's page
    const gqlResponse: SaveTransactionData = yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables
    })

    const hash = gqlResponse.data.addTransaction.hash
    navigate(`/transaction/${hash}`)

    yield put({ type: Actions.SendTransactionSuccess })
  } catch (error) {
    yield put({ type: Actions.SendTransactionFail })
  }
}

export function* rootSaga() {
  yield takeEvery(Actions.SendTransaction, sendTransaction)
}
