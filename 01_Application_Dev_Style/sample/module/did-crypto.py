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