import { Status, Actions, RootState } from '../types'

// Initial state
const initialState: RootState = {
  transactions: [],
  transactionStatus: null
}

const reducer = (state = initialState, action: any): RootState => {
  switch (action.type) {
    case Actions.SendTransactionLoading:
      return { ...state, transactionStatus: Status.loading }
    case Actions.SendTransactionSuccess:
      return { ...state, transactionStatus: Status.success }
    case Actions.SendTransactionFail:
      return { ...state, transactionStatus: Status.fail }
    default:
      return state
  }
}

export default reducer
