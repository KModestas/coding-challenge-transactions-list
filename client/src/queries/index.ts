import { gql } from "@apollo/client";

// #1 - Remove unnecessary "receipt" field from GraphQL query
export const GetAllTransactions = gql`
  query GetAllTransactions {
    getAllTransactions {
      gasLimit
      gasPrice
      to
      from
      value
      data
      chainId
      hash
    }
  }
`;

export const GetSingleTransaction = gql`
  query GetSingleTransaction($hash: String!) {
    getTransaction(hash: $hash) {
      gasLimit
      gasPrice
      to
      from
      value
      data
      chainId
      hash
    }
  }
`;

export const SaveTransaction = gql`
  mutation SaveTransaction($transaction: TransactionInput!) {
    addTransaction(transaction: $transaction) {
      hash
    }
  }
`;
