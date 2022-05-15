# Using `Geth` build private network and compile smart contract

I hope it will be useful demonstration for those who are new to the Ethereum project development.

We will not use remix IDE to understand how to fundamentally develop Ethereum-based DApps.


<br><br><br><br><br>

## [ 1 ] Overview

- [X]  Go Ethereum (Geth)
- [ ] Truffle
- [ ] Hardhat

<br><br><br><br><br>

## [ 2 ] Prerequisite

 - Install `Git` to use `bash` if your OS platform is Window > [download](https://git-scm.com/downloads)
    - Please use `bash` terminal.
 - Install `Node.js` over 14 ver. > [website](https://nodejs.org/en/)
 - Install `Geth` > [download](https://geth.ethereum.org/docs/install-and-build/installing-geth)
 - Make an account for `infura.io` > [sign up](https://infura.io/)
 - Install `Metamask`(Wallet) as Google Chrome's extensions program (you need to install `Chrome Browser` before).

<br><br><br><br><br>

## [ 3 ] Versions when this project is created

The purpose of this section is to provide information if this project fails to build.

```
node -v : v14.17.6
npm -v : 6.14.15
git --version : git version 2.35.0.windows.1
geth version : 1.10.15-stable-8be800ff
solidity ^0.8.0
```

<br><br><br><br><br>

## [ 4 ] Getting Started

#### 1. Create a directory before you begin.

```
npm init -y
mkdir eth
cd eth
mkdir go-ethereum
```

#### [2. Build Private Network](./getting_started/build_private_network.md)

#### [3. Linking Accounts with `Metamask`](./getting_started/linking_accounts_with_metamask.md)

#### 3. Create Smart Contracts
 - [ERC-20](./contracts/ERC20.md)
 - [ERC-721](./contracts/ERC721.md)

#### [4. Compile Smart Contract (example. `ERC-20`)](./getting_started/compile_smart_contract.md)