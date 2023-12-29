const abi = [
    {
        inputs: [
            { internalType: "address", name: "_factory", type: "address" },
            { internalType: "address", name: "_WETH10", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "MathOverflowedMulDiv", type: "error" },
    {
        inputs: [],
        name: "WETH10",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
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
    {
        inputs: [],
        name: "factory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
] as const
export default abi