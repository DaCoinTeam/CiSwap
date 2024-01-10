const abi = [
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint24", name: "fee", type: "uint24" },
        ],
        name: "FeeAmountEnabled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                components: [
                    { internalType: "address", name: "tokenA", type: "address" },
                    { internalType: "address", name: "tokenB", type: "address" },
                    { internalType: "uint256", name: "amountA", type: "uint256" },
                    { internalType: "uint256", name: "amountB", type: "uint256" },
                    { internalType: "uint256", name: "priceABaseX96", type: "uint256" },
                    { internalType: "uint256", name: "priceAMaxX96", type: "uint256" },
                ],
                indexed: false,
                internalType: "struct IPoolDeployer.BootstrapConfig",
                name: "config",
                type: "tuple",
            },
            {
                indexed: false,
                internalType: "address",
                name: "pool",
                type: "address",
            },
        ],
        name: "PoolCreated",
        type: "event",
    },
    {
        inputs: [],
        name: "allPools",
        outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    {
                        components: [
                            { internalType: "address", name: "tokenA", type: "address" },
                            { internalType: "address", name: "tokenB", type: "address" },
                            { internalType: "uint256", name: "amountA", type: "uint256" },
                            { internalType: "uint256", name: "amountB", type: "uint256" },
                            {
                                internalType: "uint256",
                                name: "priceABaseX96",
                                type: "uint256",
                            },
                            {
                                internalType: "uint256",
                                name: "priceAMaxX96",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct IPoolDeployer.BootstrapConfig",
                        name: "config",
                        type: "tuple",
                    },
                ],
                internalType: "struct IFactory.CreatePoolParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "createPool",
        outputs: [{ internalType: "address", name: "pool", type: "address" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "feeTo",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint24", name: "fee", type: "uint24" }],
        name: "getFeeAmountEnabled",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "tokenA", type: "address" },
            { internalType: "address", name: "tokenB", type: "address" },
            { internalType: "uint256", name: "index", type: "uint256" },
        ],
        name: "getPool",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
        name: "pools",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "setFeeTo",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const
export default abi
