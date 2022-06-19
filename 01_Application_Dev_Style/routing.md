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

#### TypeScript 버전

 - `extensions/Routing.ts`

```js
import { Router } from "express";

export type RouteOptions = {
    ignore?: boolean,
    root_path?: string
}

export type RouteElement = {
    options?:RouteOptions;
    router:Router;
}
```

 - `route-loader.ts`

```js
import * as fs from "fs";
import * as path from "path";
import { Express } from "express";
import { RouteElement }  from "../extensions/Routing";

/** 
 * @author rhie-coder
 * @dev This module helps you to import routing files and inject routing informations to application context automatically.
 *      This module is based on "Express 4"
 *      
 *      [ Setting Option Keywords ]
 *      - ignore
 *      - root_path
 * 
 * @param app The express app instance that is taken by using "express()"
 * @dependencyFile extentions/Routing.ts
 */ 
export function init(app: Express) {
    const routerlist = path.join(__dirname, "./src")
    const filelist = fs.readdirSync(routerlist).map(file => path.basename(file, path.extname(file)))

    filelist.forEach(async(filename) =>{
        const element:RouteElement = await import(`./src/${filename}`);
        if (!element?.options?.ignore) {
            app.use(element.options?.root_path ?? '/', element.router);
        }
    })
}
```