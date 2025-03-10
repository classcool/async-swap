export const fetchData = async (endpoint: string, query: string) => {
	return await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query }),
	});
};

export const hooksQuery = `
	query MyQuery {
		hooks {
			totalCount
			items {
				chainId
				hookAddress
			}
		}
	}
`;

export const currenciesQuery = `
	query MyQuery {
		currencys {
			totalCount
			items {
				address
				chainId
				decimals
				symbol
				name
			}
		}
	}
`;

export const poolsQuery = `
  query MyQuery {
    pools {
      totalCount
      items {
        chainId
        currency1
        currency0
        fee
        hooks
        poolId
        sqrtPriceX96
        tickSpacing
        tick
        token0 {
          name
          decimals
          symbol
        }
        token1 {
          name
          decimals
          symbol
        }
      }
    }
  }
`;

export const liquiditysQuery = `
	query MyQuery {
		liquiditys {
			totalCount
			items {
				chainId
				id
				liquidityDelta
				poolId
				salt
				sender
				tickLower
				tickUpper
			}
		}
	}
`;

export const operatorsQuery = `
	query MyQuery {
		operators {
			totalCount
			items {
				approved
				chainId
				operator
				owner
			}
		}
	}
`;
