## Compile Smart Contract (example. `ERC-20`)

#### 1. Go to `eth/go-ethereum/contracts`

#### 2. The `solc` module is required to compile source files written in `solidity`
 
```sh
npm i -D solc@0.8.13
```

#### 3. Add Script in `package.json`

```js
   "scripts": {
      "solc:build": "npx solc -p --bin --abi eth/go-ethereum/contracts/RhitherCoin.sol -o eth/go-ethereum/contracts/build"
   },
```

#### 4. Create `bin` and `abi`, using `solc` module.

```sh
npm run solc:build
```