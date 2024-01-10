const abi = [
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "tokenA", type: "address" },
                    { internalType: "address", name: "tokenB", type: "address" },
                    { internalType: "uint32", name: "indexPool", type: "uint32" },
                    { internalType: "uint256", name: "amountA", type: "uint256" },
                    { internalType: "uint256", name: "amountB", type: "uint256" },
                    { internalType: "uint256", name: "amountMin", type: "uint256" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint32", name: "deadline", type: "uint32" },
                ],
                internalType: "struct IRouter.AddLiquidityParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "addLiquidity",
        outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "amountIn", type: "uint256" },
                    { internalType: "uint256", name: "amountOutMin", type: "uint256" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "bytes", name: "path", type: "bytes" },
                    { internalType: "uint32", name: "deadline", type: "uint32" },
                ],
                internalType: "struct IRouter.ExactInputParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInput",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "amountIn", type: "uint256" },
                    { internalType: "uint256", name: "amountOutMin", type: "uint256" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "address", name: "tokenIn", type: "address" },
                    { internalType: "address", name: "tokenOut", type: "address" },
                    { internalType: "uint32", name: "indexPool", type: "uint32" },
                    { internalType: "uint32", name: "deadline", type: "uint32" },
                ],
                internalType: "struct IRouter.ExactInputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInputSingle",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "amountOut", type: "uint256" },
                    { internalType: "uint256", name: "amountInMax", type: "uint256" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "bytes", name: "path", type: "bytes" },
                    { internalType: "uint32", name: "deadline", type: "uint32" },
                ],
                internalType: "struct IRouter.ExactOutputParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutput",
        outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "amountOut", type: "uint256" },
                    { internalType: "uint256", name: "amountInMax", type: "uint256" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "address", name: "tokenIn", type: "address" },
                    { internalType: "address", name: "tokenOut", type: "address" },
                    { internalType: "uint32", name: "indexPool", type: "uint32" },
                    { internalType: "uint32", name: "deadline", type: "uint32" },
                ],
                internalType: "struct IRouter.ExactOutputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutputSingle",
        outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "tokenA", type: "address" },
                    { internalType: "address", name: "tokenB", type: "address" },
                    { internalType: "uint32", name: "indexPool", type: "uint32" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                    { internalType: "uint256", name: "amountAMin", type: "uint256" },
                    { internalType: "uint256", name: "amountBMin", type: "uint256" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint32", name: "deadline", type: "uint32" },
                ],
                internalType: "struct IRouter.RemoveLiquidityParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "removeLiquidity",
        outputs: [
            { internalType: "uint256", name: "amount0", type: "uint256" },
            { internalType: "uint256", name: "amount1", type: "uint256" },
        ],
        stateMutability: "payable",
        type: "function",
    },
] as const
export default abi
