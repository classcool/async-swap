#!/bin/bash

cast interface AsyncCSMM --json | sed -e '1s/^/export const AsyncCSMMAbi = /' -e '$a\'$'\n'' as const;' > ./packages/indexer/abis/AsyncCSMM.ts

cast interface Router --json | sed -e '1s/^/export const RouterAbi = /' -e '$a\'$'\n'' as const;' > ./packages/indexer/abis/Router.ts
