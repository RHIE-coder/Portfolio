## Linking Accounts with `Metamask`

We need private keys, but Geth does not offer commands to export private key.

#### 1. Import `keythereum` module

```sh
npm i -D keythereum
```

#### 2. Create JS file : `eth/go-ethereum/get-pri-key.js`

```js
/* eslint-disable prettier/prettier */
const keythereum = require("keythereum");
const path = require("path");
const fs = require("fs");

/**
 * @author rhie-coder
 * @desc This script file will help you get private keys.
 * Geth's not support to export private key directly.
 */
const rootDir = path.join(__dirname, "data");
const keystoreDir = path.join(rootDir, "keystore");

function printHelp() {
  console.log(` -- usage
      node get-pri-key.js <password1> <password2> ... : get private keys
      node get-pri-key.js help : print help
  `);
}

function argsFilter(fileList) {
  const data = [];
  for (let i = 2; i < fileList.length + 2; i++) {
    const arg = process.argv[i];
    if (arg) {
      data.push(arg);
    } else {
      printHelp();
      throw new Error("<please check password arguments>");
    }
  }
  return data;
}

function mapping(fileList, passwordList) {
  const objList = [];

  if (fileList.length !== passwordList.length) {
    throw new Error("<lists of file and password is not matched>");
  }

  for (let i = 0; i < fileList.length; i++) {
    objList.push({ account: fileList[i], password: passwordList[i] });
  }

  return objList;
}

function getPrivateKey(targets, dir) {
  targets.map((obj) => {
    const keyInfo = keythereum.importFromFile(obj.account, dir);
    const privateKey = keythereum.recover(obj.password, keyInfo);
    obj.privateKey = privateKey.toString("hex");
    return obj;
  });
}

if (process.argv[2] === "help") {
  printHelp();
  process.exit(0);
}

const fileList = fs.readdirSync(keystoreDir);
const passwordList = argsFilter(fileList);

const targets = mapping(fileList, passwordList);

// change filename to address
targets.map((obj) => {
  obj.account = JSON.parse(
    fs.readFileSync(path.join(keystoreDir, obj.account))
  ).address;

  return obj;
});

getPrivateKey(targets, rootDir);

console.log(targets);

```

#### 3. Importing accounts using private keys from `Metamask`

```sh
$ node get-pri-key.js 1111 2222 3333
[
  {
    account: '9e199512339f8ed8182a92f52d51eae90acecd73',
    password: '1111',
    privateKey: '13c17497d3820fb224f00625b51573272b234ea46890665274e14b3dc972d367'
  },
  {
    account: 'd6c36e40de2d010b7325386db5975e99a082505d',
    password: '2222',
    privateKey: '6c7d10de8059d105bd4a49c98575acff9fe11f89bb6a2e9b5462834a5be72bfb'
  },
  {
    account: 'a2401d5935191e50c6d1a49450dc0aa1d3247d5e',
    password: '3333',
    privateKey: '269ee69d6041cb90422bf3b00fc5fe3120668119857ebfbe85515b8229421047'
  }
]
```
It may take several minutes to display the balance of your local network account.