#!/bin/bash
forge script -f https://unichain-sepolia.infura.io/v3/6f57c3aef2854bd482f67669efec3acd --account msaki -vvvv script/00_DeployPoolManager.s.sol --broadcast 
sleep 3

forge script -f https://unichain-sepolia.infura.io/v3/6f57c3aef2854bd482f67669efec3acd --account msaki -vvvv script/01_DeployHook.s.sol --broadcast 
sleep 3

forge script -f https://unichain-sepolia.infura.io/v3/6f57c3aef2854bd482f67669efec3acd --account msaki -vvvv script/02_InitilizePool.s.sol --broadcast 
sleep 3

forge script -f https://unichain-sepolia.infura.io/v3/6f57c3aef2854bd482f67669efec3acd --account msaki -vvvv script/03_AddLiquidity.s.sol --broadcast 
sleep 3

forge script --rpc-url https://unichain-sepolia.infura.io/v3/6f57c3aef2854bd482f67669efec3acd --account msaki -vvvv script/04_Swap.s.sol --broadcast 
sleep 3

forge script --rpc-url https://unichain-sepolia.infura.io/v3/6f57c3aef2854bd482f67669efec3acd --account msaki -vvvv script/05_ExecuteOrder.s.sol --broadcast 
