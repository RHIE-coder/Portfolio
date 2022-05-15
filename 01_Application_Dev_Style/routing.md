## 라우팅 분리 및 자동화

 - `routes` directory (`./sample/routes`)
 - `route_loader.js`

```js
const fs = require('fs')
const path = require('path')
/* [ Setting Keywords ]
    - ignore
    - params
    - path
*/
function init(app) {
    const routerlist = path.join(__dirname, "./src")
    const filelist = fs.readdirSync(routerlist).map(file => path.basename(file, path.extname(file)))
    filelist.forEach(filename => {
        const routerinfo = require(`./src/${filename}`);
        const params = []

        if (!routerinfo.ignore) {
            if (routerinfo.params) routerinfo.params.forEach(name => params.push(app.get(name)));
            const router = Reflect.apply(
                routerinfo.routers,
                undefined,
                params
            )
            app.use(routerinfo?.path ?? '/', router);
        }
    })

}

module.exports.init = init
```

위 모듈을 통해 `src/` 디렉토리 안에 생성된 라우팅 파일들을 자동으로 가져오고, 옵션을 통해 특정 라우팅 파일을 무시하고 가져오거나 파라미터를 넣어줄 수 있습니다.

`express` 기반으로 작성되었으며, 라우팅 정보를 `express app`의 컨텍스트에 자동으로 로드(load)하기 때문에 개발자는 별도의 라우팅을 로드하는 소스코드 추가 없이 비즈니스 로직에 집중할 수 있습니다.