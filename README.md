<h1 align="center">Hello, Wemade!</h1>

<p align="center">안녕하세요.</p>

<p align="center">백엔드/블록체인 개발자 이민형입니다.</p>

<p align="center">본 문서를 통해 저의 코드스타일을 표현해보았습니다.</p>

<p align="center">( JavaScript-based )</p>

<br><br><br><br><br>

# 01. Application Dev.

저는 개발 협업을 위해 각각의 기능에 집중할 수 있도록 하고 최대한 수정이 적은 프로그래밍을 지향합니다.

예를 들어 아래와 같은 코드는 개발 협업 중에 변하지 않는 코드입니다.

```js
/**  
 * @author rhie-coder 
 * @title app.js
 */
const express = require('express');
const app = express();
const https = require('https');
const path = require('path');
const cookieParser = require('cookie-parser');
const server_session = require('express-session');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const { serverConfig } = require('./config/configurations');
const database = require("./database/mongodb");
const router_loader = require('./routes/route_loader');

// View Setting
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));

// Favicon & Static
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(server_session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
}))

// Helmet
app.use(helmet());

// Passport
const passport = require('passport');
const flash = require('connect-flash'); //passport의 플래시 메시지가 사용하는  기능
const immigration = require('./lib/immigration');
app.set('passport', passport); // Parameters Setting : passport

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
immigration.init(passport);

// Request Logging on Console
app.use("/", (req, res) => {
    console.log({
        method: req.method,
        url: req.url
    });
    req.next()
});

// Database
database.init(app, serverConfig);

// Router Mapping
router_loader.init(app);

// Running Server
https.createServer(serverConfig.httpsOpts, app).listen(serverConfig.port, () => {
    console.log(`app listening at https://localhost:${serverConfig.port}`);
});
```

위와 같은 코드가 변하지 않는 이유는 다음과 같습니다.

 - [설정 파일 분리](./01_Application_Dev_Style/config.md)
 - [인증 및 인가 역할 분리](./01_Application_Dev_Style/auth.md)
 - [라우팅 분리 및 자동화](./01_Application_Dev_Style/routing.md)
 - [RESTful 설계](./01_Application_Dev_Style/rest.md)
 - [데이터베이스 스키마 분리 및 자동화](./01_Application_Dev_Style/schema.md)
 - [암호 저장 기법](./01_Application_Dev_Style/crypto.md)


저의 위와 같은 노력들을 통해 `git`, `github`를 통한 형상관리 및 협업 툴을 사용할 때, 최대한 충돌이 적고, 더욱 용이한 `merge` 작업이 이뤄지기를 기대합니다.

<br><br><br><br><br>

# 02. JS/TS-related Works && && Smart Contract Dev.

DApp 개발 환경을 TypeScript 중심으로 개발하도록 시도하고 있습니다.

 - 테스트: `Mocha` + `Chai`
 - 코드 스타일 통합: `EsLint` + `Prettier`
 - 커버리지: `NYC`
 
스마트 컨트렉트는 [`Open Zeppelin`](https://github.com/OpenZeppelin/openzeppelin-contracts)에서 제안한 표준을 이해하고 적용해보려고 노력하고 있습니다. 또한, 개발 시 프레임워크는 [`Truffle`](https://trufflesuite.com/docs/truffle/)을 사용합니다.

#### - [Sample Project Structure](./02_JS_TS_Related_Works/sample/)

<br><br><br><br><br>

# 03. Documentation

문서화 스킬은 부서간 의사소통, API, SDK 등의 활용을 쉽게 만들고, 플랫폼과 프레임워크 시장 선점을 위해 중요한 스킬이라 생각합니다.

#### [Sample: Using `Geth` build private network and compile smart contract](./03_Documentation_Style/readme.md)


<br><br><br><br><br>

<h1 align="center">감사합니다.</h1>
