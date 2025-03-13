"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fetchData, poolsQuery } from "@/lib/queries";
import type React from "react";
import { useEffect, useState } from "react";
import type { Hex } from "viem";
import { useWriteContract } from "wagmi";
import { ERC20Abi } from "../../../../../../indexer/abis/ERC20Abi";
import { csmmAbi } from "../../../../../../indexer/abis/generated";
import type { Pool } from "../../pools/columns";

export default function AddLiquidity() {
	const [amount0, setAmount0] = useState<undefined | null | string | number>();
	const [pools, setPools] = useState<Pool[]>();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [selectPool, setSelectPool] = useState<Pool>();
	const { data: hash, isPending, writeContract } = useWriteContract();

	async function addLiquidity(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		if (!selectPool) return;
		if (!amount0) return;
		console.log(
			selectPool?.currency0,
			selectPool?.currency1,
			BigInt(amount0),
			selectPool.hooks,
		);
		writeContract({
			abi: ERC20Abi,
			address: selectPool.currency0 as Hex,
			functionName: "approve",
			args: [selectPool.hooks as Hex, BigInt(amount0)],
		});
		writeContract({
			abi: ERC20Abi,
			address: selectPool.currency1 as Hex,
			functionName: "approve",
			args: [selectPool.hooks as Hex, BigInt(amount0)],
		});

		const poolKey = {
			currency0: selectPool.currency0 as Hex,
			currency1: selectPool.currency1 as Hex,
			fee: selectPool.fee,
			tickSpacing: selectPool.tickSpacing,
			hooks: selectPool.hooks as Hex,
		} as const; // this equivalent to struct

		writeContract({
			abi: csmmAbi,
			address: selectPool.hooks as Hex,
			functionName: "addLiquidity",
			args: [poolKey, BigInt(amount0)],
		});
	}

	useEffect(() => {
		const endpoint = "http://localhost:42069";
		const fetchQueryData = async () => {
			try {
				fetchData("", "", endpoint, 31337, poolsQuery).then(async (data) => {
					console.log(data);
					setPools(data.pools.items);
				});
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unknown error occured");
				}
			} finally {
				setLoading(false);
			}
		};
		fetchQueryData();
	}, []);
	const handleSelect = (value: string) => {
		if (!pools) return;
		setSelectPool(pools[Number(value)]);
	};
	return (
		<>
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Create position</CardTitle>
					<CardDescription>Deploy your liquidity in one-click.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={addLiquidity}>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="framework">Pools</Label>
								<Select
									name="poolIndex"
									onValueChange={(value) => handleSelect(value)}
								>
									<SelectTrigger id="framework">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent position="popper">
										{pools ? (
											pools.map((pool, index) => {
												return (
													<SelectItem
														key={pool.chainId + pool.currency0 + pool.currency1}
														value={index.toString()}
													>
														{`${pool.token0.symbol}-${pool.token1.symbol}`}
													</SelectItem>
												);
											})
										) : (
											<div />
										)}
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="name">Amount</Label>
								<Input
									id="name"
									type="number"
									min={0}
									placeholder="0"
									onChange={(e) => setAmount0(e.target.value)}
								/>
							</div>
							<Button
								type="submit"
								disabled={
									isPending ||
									amount0 === undefined ||
									amount0 === "" ||
									selectPool === undefined
								}
							>
								Add Liquidity
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
