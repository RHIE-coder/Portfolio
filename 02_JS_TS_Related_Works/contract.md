## 스마트 컨트렉트 작성 & 배포

### - 스마트 컨트렉트 작성 

다음과 같은 ERC 표준에 대해 직접 작성하며 공부해보았습니다.

 - [ERC20](../03_Documentation_Style/contracts/ERC20.md)
 - [ERC721](../03_Documentation_Style/contracts/ERC721.md)

<br>
<br>
<br>
<br>
<br>

### - 스마트 컨트렉트 배포

 - `code` directory : [`rpc-flow.http`](./code/rpc-flow.http)

프레임워크가 해결하고자 하는 것이 무엇인지 직접 불편함을 느끼기 위해 아래와 같이 직접 RPC를 호출하며 스마트 컨트렉트를 배포해보았습니다. 또한 이더리움에 대한 공부까지 겸하여 이는 좋은 경험이었습니다.

```http
POST http://127.0.0.1:8545
Content-Type: application/json

{
	"jsonrpc": "2.0",
	"id": 1,
	"method": "eth_accounts",
	"params": []
}

###



POST http://127.0.0.1:8545
Content-Type: application/json

{
	"jsonrpc": "2.0",
	"method": "eth_coinbase",
    "params": [],
	"id":2
}

###

# (100000000000000000).toString(16) --> 16345785d8a0000
# parseInt("16345785d8a0000",16)    --> 100000000000000000
# parseInt("0x16345785d8a0000",16)  --> 100000000000000000
# OR
# geth attach --> web3.toHex(100000000000000000) --> 16345785d8a0000
										 
POST http://127.0.0.1:8545
Content-Type: application/json

{
	"jsonrpc": "2.0",
	"method": "eth_sendTransaction",
	"params":[{
        "from": "0x70153a8b8b6d9e55a38a5f27cc96bac1e78ee3a6",
        "to": "0x13939699b4bcb04e09f1929a8c01cb30bfd5a369",
        "value": "0x16345785d8a0000"
    }],
	"id":3
}

###

POST http://127.0.0.1:8545
Content-Type: application/json

{
	"jsonrpc": "2.0",
	"id": 4,
	"method": "eth_sendTransaction",
	"params": [{"from":"0x13939699b4bcb04e09f1929a8c01cb30bfd5a369","data":"0x608060405234801561001057600080fd5b506101bd806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063371303c01461004657806367e0badb14610050578063b3bcfa821461006e575b600080fd5b61004e610078565b005b610058610091565b60405161006591906100cc565b60405180910390f35b61007661009a565b005b60008081548092919061008a90610116565b9190505550565b60008054905090565b6000808154809291906100ac9061015e565b9190505550565b6000819050919050565b6100c6816100b3565b82525050565b60006020820190506100e160008301846100bd565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610121826100b3565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610153576101526100e7565b5b600182019050919050565b6000610169826100b3565b91506000820361017c5761017b6100e7565b5b60018203905091905056fea2646970667358221220ea5803bb1f17f9240ec09bed75a027c9bb07e159fcabe2e02ccc78c4d52911ea64736f6c634300080d0033"}]
}

###

POST http://127.0.0.1:8545
Content-Type: application/json

{
	"jsonrpc": "2.0",
	"id": 5,
	"method": "eth_getTransactionReceipt",
	"params": ["0x298fbf7c2bfd6f647af302675cdb0fec43d1a371d3244763933d8c069aac86d8"]
}


###

# web3.sha3("getNum()").substring(0,10) --> 0x67e0badb
# web3.sha3("inc()").substring(0,10) --> 0x371303c0
# sha3 method has been deprecated for keccak()

POST http://127.0.0.1:8545
Content-Type: application/json

{
	"jsonrpc": "2.0",
	"method": "eth_call",
	"params":[{"from": "0x13939699b4bcb04e09f1929a8c01cb30bfd5a369","to": "0xc84f910d72ae8ef033b8da700dca20bd72a95bb2","data": "0x67e0badb"},"latest"],
	"id":6
}

###


POST http://127.0.0.1:8545
Content-Type: application/json

{
	"jsonrpc": "2.0",
	"method": "eth_sendTransaction",
	"params":[{"from": "0x13939699b4bcb04e09f1929a8c01cb30bfd5a369","to": "0xc84f910d72ae8ef033b8da700dca20bd72a95bb2","data": "0x371303c0"}],
	"id":7
}


###

POST http://127.0.0.1:8545
Content-Type: application/json

{
	"jsonrpc": "2.0",
	"method": "eth_call",
	"params":[{"from": "0x13939699b4bcb04e09f1929a8c01cb30bfd5a369","to": "0xc84f910d72ae8ef033b8da700dca20bd72a95bb2","data": "0x67e0badb"},"latest"],
	"id":8
}
```