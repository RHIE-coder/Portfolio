## 암호 저장 기법

 - `database` directory (`./sample/database`)
 - `schema/member.js`

```js
const crypto = require('crypto')

module.exports = {
    name: 'member',
    schema: {
        username: String, // String is shorthand for {type: String}
        hashed_password: String,
        nickname: String,
        salt: String,
        reg_date: { type: Date, default: Date.now },
    },
    method: [
        makeSalt, 
        encryptPasswordString, 
        makeEncryptedPassword, 
        authenticate
    ]
};

function makeSalt(){
    this.salt = Math.round((new Date().valueOf() * Math.random())) + '';
}

function encryptPasswordString(plainText){
    return crypto.createHmac('sha256', this.salt).update(plainText).digest('hex')
}

function makeEncryptedPassword(plainText){
    this.makeSalt();
    this.hashed_password = encryptPasswordString.bind(this)(plainText);
}

function authenticate(plainText){
    return this.hashed_password === encryptPasswordString.bind(this)(plainText);
}
```

저는 비밀번호를 평문(plain text)이 아닌 Hash 형태로 저장합니다. 또한, 레인보우 공격(`Rainbow Attack`)을 대비하여 난수를 생성해 `salt` 값을 추가해 해싱(Hashing)합니다.