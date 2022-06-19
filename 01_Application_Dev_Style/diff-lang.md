## 상이한 개발 언어로 프로그래밍된 모듈 활용 시도

### Caller(`JavaScript`) <---> Callee(`Python`)


#### - Callee(`Python`)

 - `module` directory (`./sample/module`) : `did-crypto.py`

```py
import sys
import json
import asyncio
import base64

from indy import crypto, did, wallet

async def create_wallet(params):
    msg = dict()

    wallet_config = json.dumps(params['wallet_config'])
    wallet_credentials = json.dumps(params['wallet_credentials'])

    await wallet.create_wallet(wallet_config, wallet_credentials)
    
    msg['result'] = 'success'

    return msg

async def create_did(params):
    msg = dict()

    wallet_config = json.dumps(params['wallet_config'])
    wallet_credentials = json.dumps(params['wallet_credentials'])

    wallet_handle = await wallet.open_wallet(wallet_config, wallet_credentials)

    (my_did, my_vk) = await did.create_and_store_my_did(wallet_handle, "{}")

    msg['did'] = my_did
    msg['verkey'] = my_vk

    await wallet.close_wallet(wallet_handle)

    return msg

async def did_list(params):
    msg = dict()

    wallet_config = json.dumps(params['wallet_config'])
    wallet_credentials = json.dumps(params['wallet_credentials'])

    wallet_handle = await wallet.open_wallet(wallet_config, wallet_credentials)

    did_list = await did.list_my_dids_with_meta(wallet_handle)
    msg = did_list

    await wallet.close_wallet(wallet_handle)

    return msg

async def sign_message(params):

    wallet_config = json.dumps(params['wallet_config'])
    wallet_credentials = json.dumps(params['wallet_credentials'])
    my_vk = params['verkey']
    target = params['target']

    wallet_handle = await wallet.open_wallet(wallet_config, wallet_credentials)
    
    encrypted_msg = await crypto.crypto_sign(wallet_handle, my_vk, target)

    await wallet.close_wallet(wallet_handle)
    encrypted_msg_base64 = base64.b64encode(encrypted_msg)
    msg = encrypted_msg_base64.decode('utf-8')

    return msg

async def sign_verify(params):

    verkey = params['verkey']
    plain = params['plain']
    signature_base64 = params['signature']

    signature_base64 = bytes(signature_base64, 'utf-8')
    signature = base64.b64decode(signature_base64)
    
    is_verified = await crypto.crypto_verify(verkey, plain, signature)

    if is_verified==True:
        msg = 'verified'
    else:
        msg = 'non-match'


    return msg


async def make_challenge(params):
    verkey = params['verkey']
    target = params['target']

    challenge = await crypto.anon_crypt(verkey, target.encode('utf-8'))
    
    challenge_base64 = base64.b64encode(challenge)
    msg = challenge_base64.decode('utf-8')

    return msg


async def verify_challenge(params):

    wallet_config = json.dumps(params['wallet_config'])
    wallet_credentials = json.dumps(params['wallet_credentials'])

    wallet_handle = await wallet.open_wallet(wallet_config, wallet_credentials)
    
    verkey = params['verkey']
    challenge_base64 = params['challenge']

    challenge_base64 = bytes(challenge_base64, 'utf-8')
    challenge = base64.b64decode(challenge_base64)

    response = await crypto.anon_decrypt(wallet_handle, verkey, challenge)

    await wallet.close_wallet(wallet_handle)

    msg = response.decode('utf-8')

    return msg


async def test(params):
    return params

async def invoke(coroutine, params):
    result = await coroutine(params)
    print(result)

if __name__ == '__main__':
    func_map = dict()
    func_map['create_wallet'] = create_wallet
    func_map['create_did'] = create_did
    func_map['did_list'] = did_list
    func_map['sign_message'] = sign_message
    func_map['sign_verify'] = sign_verify
    func_map['make_challenge'] = make_challenge
    func_map['verify_challenge'] = verify_challenge

    func_name = sys.argv[1]
    param_obj_str = sys.argv[2]
    params = json.loads(param_obj_str)

    try:
        loop = asyncio.get_event_loop()
        loop.run_until_complete(invoke(func_map[func_name], params))
        loop.close()

    except:
        msg = dict()
        msg['msg'] = 'fail'
        print(msg)
```

<br><br><br><br><br>

#### - Caller(`JavaScript`)

 - `lib` directory (`./sample/lib`) : `did_crypto_caller.js`

```js
/* Utils */
function deepJSONstring(json) {
    let cache = [];
    const data = JSON.stringify(json, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            // Duplicate reference found, discard key
            if (cache.includes(value)) return;

            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, 2);
    cache = null; // Enable garbage collection

    return data;
}

/* Main */
const spawn = require('child_process').spawn;

function did_crypto_call(funcName, paramObj) {
    const python_module = spawn('python3', [`${process.cwd()}/../module/did-crypto.py`, 
                                             funcName, 
                                             JSON.stringify(paramObj)])
    return new Promise(
        function (resolve, reject) {
            python_module.stdout.on('data', function (result) {
                resolve(result.toString())
            })
        })
}

module.exports = {deepJSONstring, did_crypto_call}
```

<br>
<br>
<br>
<br>
<br>

### 활용 예시

```js
const did_crypto_call = require('./lib')['did_crypto_call']

function line(message){
    if(message !== undefined){
        console.log(`===============${message}===============`)
    }else{
        console.log(`========================================`)
    }
    console.log()
    console.log()
}

const wallet_config = { id: "test3-wallet" }
const wallet_credentials = { key: "test2-wallet-key" }

const wallet_args = {
        wallet_config,
        wallet_credentials,
    }

line("CREATE WALLET")
const wallet_result = await did_crypto_call("create_wallet", wallet_args)
console.log(wallet_result)

line("CREATE DID")
const did_result = await did_crypto_call("create_did", wallet_args)
console.log(did_result)


line("DID LIST")
const list_result = await did_crypto_call("did_list", wallet_args)
console.log(list_result)

line("GET DID -> READY TO SIGN")
const get_did_list = await did_crypto_call("did_list", wallet_args)
const did_list = JSON.parse(get_did_list);
const did_set = did_list[0]
console.log(get_did_list)

const my_did = did_set['my_did']
const verkey = did_set['verkey']
const target = 'hello world'

const sign_args = {
        ...wallet_args,
        verkey,
        target
    }

line("SIGN MESSAGE")
const sig = await did_crypto_call("sign_message", sign_args)
const signature = sig.trim()
console.log("sign : " + signature)


line("SIGN VERIFY")
const verify_args = {
        verkey,
        plain : target,
        signature
    }

const verify_result = await did_crypto_call("sign_verify", verify_args)
console.log(verify_result)
    

line("MAKE CHALLENGE")
const make_challenge_args = {
        verkey,
        target
    }
const chall = await did_crypto_call("make_challenge", make_challenge_args)
const challenge = chall.trim()
console.log(challenge)

line("VERIFY CHALLENGE")
const verify_challenge_args = {
        ...wallet_args,
        verkey,
        challenge,
    }
const res = await did_crypto_call("verify_challenge", verify_challenge_args)
console.log(res)
```

위 코드와 같이 `did_crypto_call()` 함수에 호출할 함수 이름과 인수(Parameters)에 들어갈 인자(Arguments) 값들만 넘겨주면 되는 코드입니다.

#### 아쉬운 점

프로세스를 통한 방식은 문자열 처리에 문제가 있어 `Base64`과 같이 특정 방식으로 인코딩하여 전달해야만 했습니다. 그리고 에러 코드를 알기 힘들어 디버깅에 힘들었습니다. 보시다시피 본 방식은 `RPC(Remote Procedure Call)`과 유사합니다. 차라리 JSON-RPC 서버를 두어 통신하였으면 좋았을 것 같습니다.