const abi = [
    {
        inputs: [
            { internalType: "uint256", name: "secondOffset", type: "uint256" },
            { internalType: "uint16", name: "numberOfSnapshots", type: "uint16" },
            { internalType: "address", name: "tokenA", type: "address" },
            { internalType: "address", name: "tokenB", type: "address" },
            { internalType: "uint32", name: "indexPool", type: "uint32" },
        ],
        name: "aggregateLiquidity",
        outputs: [
            { internalType: "uint256[]", name: "liquidities", type: "uint256[]" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "secondOffset", type: "uint256" },
            { internalType: "uint16", name: "numberOfSnapshots", type: "uint16" },
            { internalType: "bytes", name: "path", type: "bytes" },
        ],
        name: "aggregatePriceX96",
        outputs: [
            { internalType: "uint256[]", name: "priceX96s", type: "uint256[]" },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const
export default abi
