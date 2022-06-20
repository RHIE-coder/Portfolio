<h1 align="center">Portfolio</h1>

<p align="center">안녕하세요.</p>

<p align="center">백엔드/블록체인 개발자 이민형입니다.</p>

<p align="center">Java-Spring 개발로 시작하여 블록체인 연구를 위해 대학원에 들어간 후 JavaScript 기반 개발을 주로 하고 있습니다.</p>

<p align="center">주 연구 키워드로 Hyperledger, DID가 있습니다.</p>

<p align="center">현재는 블록체인 산업 및 기업들의 니즈에 맞춰서 Ethereum 생태계 중심의 개발을 하고 있습니다.</p>

<p align="center">저의 코드 스타일과 기술 경험들을 소개하겠습니다.</p>

<p align="center">"JavaScript-based"</p>

<br><br><br><br><br>

# 01. Application Dev.

저는 수정이 적은 코드 및 개발 협업에 용이한 코드를 작성하려고 노력합니다.

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

보여드린 위 Immutable한 코드를 기반으로 개발 협업을 더 쉽게 하기 위해 아래와 같은 노력들을 해보았습니다.

 - [설정 파일 분리](./01_Application_Dev_Style/config.md)
 - [인증 및 인가 역할 분리](./01_Application_Dev_Style/auth.md)
 - [라우팅 분리 및 자동화](./01_Application_Dev_Style/routing.md)
 - [데이터베이스 스키마 분리 및 자동화](./01_Application_Dev_Style/schema.md)
 - [RESTful 설계](./01_Application_Dev_Style/rest.md)

저의 위와 같은 노력들을 통해 `git`, `github`를 통한 형상관리 및 협업 툴을 사용할 때, 최대한 충돌이 적고, 더욱 용이한 `merge` 작업이 이뤄지기를 기대합니다.

또한, 복잡해지고 난잡해질 수 있는 코드는 최대한 모듈화하여 사용을 편하게 하려는 습관을 가지고 있습니다.

 - [모듈화 예시 코드: API Caller](./01_Application_Dev_Style/sample/module/coupang-api-requester.js)

위 코드는 내부적으로 어떻게 구성되어 있는지 알 필요없이 `getData` 함수만 사용하면 됩니다. 옵션과 요청Body만 잘 넘겨주면 내부적으로 옵션을 파싱(Parsing)하고 플랫폼에서 요구한 형식대로 Header를 구성하여 API 요청처리가 되는 모듈입니다. 디버깅을 위해 Verbose 모드까지 생각해 보았습니다.

상이한 개발 언어로 구축된 모듈 간 통신으로 아래와 같은 노력을 해보았습니다.

 - [상이한 개발 언어로 프로그래밍된 모듈 활용 시도 : DID-related Crypto](./01_Application_Dev_Style/diff-lang.md)

추가로, 보안을 위한 생각도 자주합니다.

 - [암호 저장 기법](./01_Application_Dev_Style/crypto.md)


<br><br><br><br><br>

# 02. JS/TS-related Works `&&` Blockchain Dev.

현재 DApp 개발 환경을 TypeScript 중심으로 개발하도록 시도하고 있습니다.

 - 테스트: `Mocha` + `Chai`
 - 코드 스타일 통합: `EsLint` + `Prettier`
 - 커버리지: `NYC`

스마트 컨트렉트(Smart Contract)는 [`Open Zeppelin`](https://github.com/OpenZeppelin/openzeppelin-contracts)에서 제안한 표준을 이해하고 적용해보려고 노력하고 있습니다. 또한, 개발 시 프레임워크는 [`Truffle`](https://trufflesuite.com/docs/truffle/)을 사용합니다.

그 전에 프레임워크 도움 없이 스마트 컨트렉트 작성 및 RPC 호출을 통한 스마트 컨트렉트 배포까지 해보았습니다.

 - [스마트 컨트렉트 작성 & 배포](./02_JS_TS_Related_Works/contract.md)


모듈을 만드는 것을 즐겨하여 다음과 같은 모듈을 만들어 사용해보았습니다.

 - [이더리움 RPC & Web3 RPC 모듈](./02_JS_TS_Related_Works/web3rpc.md)


<!-- #### [현재 개발 중인 예시 프로젝트: Rhithereum](https://github.com/RHIE-coder/Rhithereum) -->

블록체인 관련 스크립트를 만드는 등의 CLI 전용 파일을 만드는 것도 좋아합니다.

 - [스크립트 파일 예시](./03_Documentation_Style/getting_started/linking_accounts_with_metamask.md)

<br><br><br><br><br>

# 03. Documentation

문서화 스킬은 부서간 의사소통, API, SDK 등의 활용을 쉽게 만들고, 플랫폼과 프레임워크 시장 선점을 위해 중요한 스킬이라 생각합니다. `기억보단 기록이며 기록이 곧 기술이다`라는 철학을 가지고 있습니다.

#### [Sample: Using `Geth` build private network and compile smart contract](./03_Documentation_Style/readme.md)

#### [Hyperledger Fabirc 관련 지식 공유](https://github.com/RHIE-coder/Playground.Hyperledger-Fabric)

#### [Hyperledger Indy 관련 지식 공유](https://github.com/RHIE-coder/Playground.Hyperledger-Indy)

#### [Hyperledger Aries 관련 지식 공유](https://github.com/RHIE-coder/Playground.Hyperledger-Aries)

또한 팀원들과 함께 성장하고 의사소통 비용을 줄이기 위해 문서를 읽고 그 내용을 이해하여 타인에게 전달하는 능력도 중요하다고 생각합니다. 다음 PPT 자료는 제가 대학원 때 [DID 관련 문서](https://www.w3.org/TR/did-core/)와 [OAuth 관련 문서](https://datatracker.ietf.org/doc/html/rfc6749)를 읽고 발표한 자료들입니다.

 - [Decentralized Identifiers](./Decentralized%20Identifiers.pptx)
 - [OAuth2.0](./OAuth2.0.pptx)

<br><br><br><br><br>


# 04. Other Experience

#### [DeepFakeDetection Project](https://github.com/RHIE-coder/Project.DeepFakeDetection) --> `workspace` 폴더를 확인하시면 됩니다

본 딥러닝 프로젝트는 [Kaggle](https://www.kaggle.com/c/deepfake-detection-challenge)에 있는 데이터들을 활용했습니다. 그리고 먼저 전처리 및 학습 전략을 세우고, 과적합을 피하면서 정확도를 높이기 위해 다양한 모델 레이어를 적용해보았습니다.

#### NOTICE
```
간혹 주피터 노트북 용량으로 인해 한번에 뜨지 않아 대기시간(대략 10초 내)이 있을 수 있습니다.
깃허브측에서 주어진 시간 안에 데이터를 로딩하지 못하면 로딩 실패로 간주하는 것이 원인으로 보여집니다.
만일 로드하지 못했다고 계속 뜬다면 3초 간격으로 새로고침하시면 됩니다.
```
사실 딥러닝 CNN(Convolutional Neural Networks)관련 알고리즘에 대한 전문적인 지식 없이 이미 훌륭한 분들이 만들어낸 라이브러리 및 프레임워크를 단순하게 활용한 정도라 감히 내세울 부분은 아니라고 생각이 듭니다.

그래도 개발자로서 `인공지능`을 활용한 어플리케이션 개발 역량은 언젠가는 필요한 기술이라 열심히 했던 기억에 조심스럽게 드러내봅니다. 또한, 어떠한 낯선 도전 과제가 주어지든 상관없이 기어코 해결하는 저의 열정을 보여주고 싶었습니다.

<br><br><br><br><br>

<h1 align="center">감사합니다.</h1>
