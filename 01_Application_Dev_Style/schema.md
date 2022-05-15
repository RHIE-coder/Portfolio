## 데이터베이스 스키마 분리 및 자동화

 - `database` directory (`./sample/database`)
 - `mongodb.js`

```js
const mongoose = require('mongoose');
const fs = require('fs')
const path = require('path')

function init(app, config) {
    mongoose.connect(`${config.db_uri}/${config.db_name}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    modellist = loadSchema(mongoose);

    app.set("db_model_list",modellist)
}

function loadSchema(mongoose){
    const schemadir = path.join(__dirname, "./schema")
    const modellist = {}
    const filelist = fs.readdirSync(schemadir)
    filelist.forEach(file=>{
        const filename = path.basename(file,path.extname(file));
        let schema_info = require(`./schema/${filename}`);
        const schema = mongoose.Schema(schema_info.schema);
        if(schema_info.method) schema_info.method.forEach(m=>schema.method(m.name, m));
        if(schema_info.static) schema_info.static.forEach(s=>schema.static(s.name, s));
        modellist[schema_info.name] = mongoose.model(schema_info.name, schema)
    })

    return modellist;
}

module.exports.init = init;
```

`express`와 `mongoose` 기반으로 작성된 위 모듈을 통해 `schema/` 디렉토리에 정의된 스키마, 인스턴스 메서드, 정적 메서드들을 자동으로 추가하여 `express app`의 컨텍스트 속에 로드(load)합니다. 이를 통해 개발자는 스키마와 성격과 특성에 맞게 분리하고 관련된 메서드들을 추가할 수 있습니다.