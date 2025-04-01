# Async Swap CSMM Hook

We use Uniswap V4’s hook to implement a new batch-auction style MEV-resilient mechanism for AMM. Our approach expands the recent theoretical work of https://dl.acm.org/doi/10.1145/3564246.3585233, and mitigates MEVs by imposing a specific transaction ordering rule so that transactions in different directions (buy or sell) are matched as much as possible. A technical challenge in our hook implementation is that we need to impose constraints (the transaction ordering rule) on the block level instead of individual transaction levels. Our MEV-resilient AMM has a nice property in that an MEV-maximizing builder will order transactions in such a way that no MEV opportunities remain.


Batch auctions have been advocated for preventing manipulative behaviors either in traditional limit-order markets (e.g., Budish, Crampton, and Shin 2015 against HFT rat race) or on AMMs (e.g., Ferreira and Parks 2023 against MEV). In this project, we demonstrate how Uniswap V4 hooks can implement batch auctions natively on constant-product AMMs. We overcome the technical challenge in our hook implementation in that we need to impose constraints (the transaction ordering rule) on the block level instead of individual transaction levels. Our resulting MEV-resilient AMM has a nice property in that an MEV-maximizing builder will order transactions in such a way that no MEV opportunities remain.

## Install

To install dependencies in all our packages in `packages/*`

```bash
bun install
```

Install foundry dependencies (v4-periphery)

```sh
forge install
```

## Setup

> [!TIP]
> We suggest you set up local anvil account with cast.
>
> ```sh
> cast wallet import --mnemonic "test test test test test test test test test test test junk" anvil
> ```
>
> - This will allow you to use `--account anvil` in the deploys scripts in [`./start_script.sh`](./start_script.sh)

Run local anvil node

```sh
anvil
# or simulate block mining and finality
anvil --block-time 13
```

## Local Deployment

Run deployment script

```sh
./start_script.sh # scripts that you use --account setup of you choice
```

> [!NOTE]
>
> The start scripts will do the following:
>
> 1. Deploy local PoolManger [`./script/00_DeployPoolManager.s.sol`](./script/00_DeployPoolManager.s.sol)
> 2. Deploy Hook & Router contracts [`./script/01_DeployHook.s.sol`](./script/01_DeployHook.s.sol)
> 3. Initialize a pool with your hook attached [`./script/02_InitilizePool.s.sol`](./script/02_InitilizePool.s.sol)
> 4. Add liqudity to previously initialized pool [`./script/03_AddLiquidity.s.sol`](./script/03_AddLiquidity.s.sol)
> 5. Submit an async swap transaction through custom router [`./script/04_Swap.s.sol`](./script/04_Swap.s.sol)
> 6. Fill previously submitted swap transaction [`./script/05_ExecuteOrder.s.sol`](./script/05_ExecuteOrder.s.sol)

## Testing

Run tests

```sh
forge test -vvvv
```

## Offchain Indexer `packages/indexer`

Start local indexer

```sh
bun run dev
```

> [!Tip]
>
> We use an indexer local to index hook events in [packages/indexer](./packages/indexer/)

Go to [http://localhost:42069](http://localhost:42069) to query orders and hook events

## Frontend UI

- Lives demo: [repo](https://github.com/classcool/frontend)
- Frontend repo: [live demo](https://frontend-mu-one-27.vercel.app/dashboard/orders)

> [!NOTE]
>
> - Screenshots
>   ![Transaction List UI](./frontend-ui.png)
>   ![Filler UI - Async Swap](./filler-ui.png)

## Acknowledgment

Thanks to [Atrium Academy](https://atrium.academy), over the past 2 months we build this project during Uniswap Hook incubator program.

Team Socials:

- Meek [X](https://x.com/msakiart), [github](https://github.com/mmsaki)
- Jiasun Li [X](https://x.com/mysteryfigure), [github](https://github.com/mysteryfigure)
