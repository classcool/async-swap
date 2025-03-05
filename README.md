# hook-starter

Frontend + Indexer + Foundry monorepo for end-to-end development of Uniswap V4 hooks. 


## Install

To install dependencies

> [!NOTE]
> This will install dependencies from all our packages in `packages/*`

```bash
bun install
```

## Setup

> [!TIP]
> Set up local anvil node, and create wallet from anvil accounts
>
> - This allows us to use `--account anvil` in our deploys scripts
>
> ```sh
> cast wallet import --mnemonic "test test test test test test test test test test test junk" anvil
> ```

Run local anvil node

```sh
anvil
# or to simulate block mining
anvil --block-time 1
```

Deploy PoolManger

```sh
forge script --broadcast --rpc-url localhost:8545 --account anvil -vvvv script/00_DeployPoolManager.s.sol
```

Deploy Hook

```sh
forge script --broadcast --rpc-url localhost:8545 --account anvil -vvvv script/01_DeployHook.s.sol
```

Initialize a pool with your hook attached

```sh
forge script --broadcast --rpc-url localhost:8545 --account anvil -vvvv script/02_InitilizePool.s.sol
```

## Indexer `packages/indexer`

Go to indexer

```sh
cd packages/indexer
```

Start local ponder indexer

```sh
bun run dev
```

Got to [http://localhost:42069](http://localhost:42069)

## Frontend `packages/app`

Go to app

```sh
cd packages/app
```

Start frontend

```sh
bun run dev
```

Go to [http://localhost:3000](http://localhost:3000)
