## 인증 및 인가 역할 분리

### - Authentication(AuthN) + Authorization(AuthZ)

 - `lib` directory (`./sample/lib`)
 - `passport_strategy/local-strategy.js`

```js
var LocalStrategy = require('passport-local').Strategy;

/* 로그인 */
module.exports.login = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, username, password, done) {
  console.log(`[inform]invoked passport's local login : ${username}, ${password}`)

  const Member = req.app.get('db_model_list')['member'];

  Member.findOne({ username: username }, (err, user) => {
    if (err) { return done(err); }
    // 등록된 사용자가 없는 경우
    if (!user) { return done(null, false, { message: "login fail" }); }
    //비밀번호 비교
    const isAuthenticated = user.authenticate(password)
    // 비밀번호 비교 결과가 틀림
    if (!isAuthenticated) { return done(null, false, { message: "password is not correct" }); }
    // 비밀번호 비교 결과가 맞음
    return done(null, user);
  })
});


/* 회원가입 */
module.exports.signup = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
}, function (req, username, password, done) {
  console.log(`[inform]invoked passport's local signup : ${username}, ${password}`)

  const Member = req.app.get('db_model_list')['member'];

  const password_check = req.body["password-check"];

  // 비밀번호 일치 확인
  if (password !== password_check) { return done(null, false, { message: "passwords are not same" }); }

  Member.findOne({ username: username }, (err, user) => {
    if (err) { return done(err); }

    // 등록된 사용자가 있다면
    if (user) { return done(null, false, { message: "already exists" }); }

    const new_user = new Member({
      username: username,
      nickname: req.body.nickname,
    })
    new_user.makeEncryptedPassword(password);
    new_user.save(err => { return done(null, new_user); })

  })
});
```

 - `immigration.js`

```js
var {login, signup} = require('./passport_strategy/local-strategy');

module.exports.init = function (passport) {
    // 사용자 인증 성공 시 호출
    passport.serializeUser(function (user, done) {
        console.log('serializeUser() 호출됨.');
        done(null, user);
    });

    // 사용자 인증 이후 사용자 요청이 있을 때마다 호출
    passport.deserializeUser(function (user, done) {
        console.log('deserializeUser()  호출됨');
        done(null, user);
    });

    // 인증방식  local-signup
    passport.use('local-login', login);
    passport.use('local-signup', signup);
};
```

<br><br><br>

### - AuthZ

 - `middleware` directory (`./sample/middleware`)
 - `access_control.js`

```js
function logined_redirect_home(req, res, next) {
    console.log('logined_redirect_home() is invoked : ' + req.isAuthenticated());
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        next();
    }
}

function not_logined_redirect_login(req, res, next) {
    console.log('not_logined_redirect_login() is invoked : ' + req.isAuthenticated());
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    logined_redirect_home,
    not_logined_redirect_login,
}
```