export type PageDirection = "next" | "prev" | ""
export const fetchData = async (
		cursor: string,
		direction: PageDirection,
		endpoint: string,
		chainId: number | "",
		queryTemplate: (cursor: string, direction: PageDirection, chainId: number | "") => void,
	) => {
		const query = queryTemplate(cursor, direction, chainId);
		const variables = new Object() as { cursor: string, chainId: number | string }
		if (cursor) variables.cursor = cursor
		if (chainId) variables.chainId = chainId
		const body = variables
			? JSON.stringify({ query: query, variables: variables })
			: JSON.stringify({ query: query });
		const res = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: body,
		});
		const json = await res.json();
		// console.log("👾 ", json)
		return json.data;
	};



export function hooksQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	let id = "$chainId"
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	let opts = `(${c}, where: { chainId: ${id}})`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
		hooks ${opts} {
			items {
				chainId
				hookAddress
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
	}
`;
}

export function currencysQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	let id = "$chainId"
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	let opts = `(${c}, where: { chainId: ${id}})`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
		currencys ${opts} {
			items {
				address
				chainId
				decimals
				symbol
				name
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
	}
`;
}

export function poolsQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	let id = "$chainId"
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	let opts = `(${c}, where: { chainId: ${id}})`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
    pools ${opts} {
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
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
    }
  }
`;
}

export function liquiditysQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	let id = "$chainId"
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	let opts = `(${c}, where: { chainId: ${id}})`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
		liquiditys ${opts} {
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
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
	}
`;
}

export function operatorsQuery(cursor: string, direction: PageDirection) {
	let c = "after: $cursor";
	let id = "$chainId"
	if (cursor) {
		c = `${direction === "next" ? "after" : "before"}: $cursor`;
	}
	let opts = `(${c}, where: { chainId: ${id}})`;
	return `
	query MyQuery($cursor: String, $chainId: Int) {
		operators ${opts} {
			items {
				approved
				chainId
				operator
				owner
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
	}
`;
}
