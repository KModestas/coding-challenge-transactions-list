import { ethers } from 'ethers';

// #7 - Add utility functions to convert values to human readable formats. Centralise these functions inside a single place so that they can easily be used throughout the app.

export const convertWeiToEth = (wei = '') => {
  return ethers.formatEther(wei);
}

export const shortenAddress = (address = '', chars = 4) => {
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}