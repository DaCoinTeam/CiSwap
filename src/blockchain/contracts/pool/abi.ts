const abi = [
    {
        inputs: [],
        name: "deployParams",
        outputs: [
            { internalType: "address", name: "factory", type: "address" },
            { internalType: "uint24", name: "fee", type: "uint24" },
            {
                components: [
                    { internalType: "address", name: "tokenA", type: "address" },
                    { internalType: "address", name: "tokenB", type: "address" },
                    { internalType: "uint256", name: "amountA", type: "uint256" },
                    { internalType: "uint256", name: "amountB", type: "uint256" },
                    { internalType: "uint256", name: "priceABaseX96", type: "uint256" },
                    { internalType: "uint256", name: "priceAMaxX96", type: "uint256" },
                ],
                internalType: "struct IPoolDeployer.BootstrapConfig",
                name: "config",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const
export default abi
