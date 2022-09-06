export const networkConfig = {
  242: [
    {
      gatewayAddress: '0xBB72E5735bfE17637c5B3E74F7749Ba54Eaf03C0', //proxy address
      networkName: 'kardiachain_test',
    },
  ],
}

export const getConfigByChain = (chain) => networkConfig[chain]
