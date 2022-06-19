## 이더리움 RPC & Web3 RPC 모듈

### - 이더리움 RPC 모듈

 - `code` directory : [`json-rpc-requester.ts`](./code/json-rpc-requester.ts)

`JSON-RPC` 프로토콜에 대응하기 위해 Axios를 활용하여 코드의 간결한 사용을 위해 요청 모듈을 만들어보았습니다. 엄격한 모듈 활용을 위해 `TypeScript`를 활용했습니다.

#### 모듈 활용 샘플

```js
import {JsonRpcRequester} from "./lib/json-rpc-request";

const rpc = new JsonRpcRequester("http://localhost:8545");

async function main(){
    console.log(await rpc.request({method:"eth_chainId",id:1}))
    const account = (await rpc.request({method:"eth_accounts",id:2})).result[0];
    console.log(account)
}

main();
```

<br>
<br>
<br>
<br>
<br>

### - Web3 RPC 모듈

 - `code` directory : [`web3-contract.ts`](./code/web3-contract.ts)

`Web3` 라이브러리를 통해서 스마트 컨트렉트 객체를 얻는 과정 속에서 반복적인 코드 작업이 많아 본 모듈을 만들게 되었습니다. 이 모듈 또한 엄격한 모듈 활용을 위해 `TypeScript`를 활용했습니다.

#### 모듈 활용 샘플

```js
import * as path from "path";
import {ContractHandler} from "./lib/web3-contract";
import {JsonRpcRequester} from "./lib/json-rpc-request";

const rpc = new JsonRpcRequester("http://localhost:8545");

async function main(){
    const account = (await rpc.request({method:"eth_accounts",id:1})).result[0];

    const options = {
        contractAddress:"0xc84f910d72ae8ef033b8da700dca20bd72a95bb2",
        accountAddress:account,
        abiPath:path.join(__dirname, "../blockchain/truffle/build/contracts"),
        abiName:"Simple"
    }
    const handler = new ContractHandler(options);
    const contract = await handler.getContract();

    await contract.methods.inc().send();
    const get_result = await contract.methods.getNum().call();
    console.log(get_result);
}

main();
```