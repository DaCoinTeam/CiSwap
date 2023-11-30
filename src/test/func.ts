const pools = [
    {
        address: 1,
        token0: "STARCI",
        token1: "USDT"
    },
    {
        address: 2,
        token0: "USDT",
        token1: "BUSD"
    },
    {
        address: 3,
        token0: "USDT",
        token1: "GRPC"
    }
]

function _addInitialPools(startToken: string): number[][] {
    const paths: number[][] = [[]]
  
    for (let i = 0; i < pools.length; i++) {
        const pool = pools[i]
  
        const path: number[] = []
        const token0 = pool.token0
        const token1 = pool.token1
  
        const lastToken = startToken === token0 ? token1 : token0
  
        if (token0 === lastToken || token1 === lastToken) {
            const pathClone = [...path]
            pathClone[0] = pool.address
  

            paths.push(pathClone)
        }
    }
  
    return paths
}
  
console.log(_addInitialPools("STARCI"))