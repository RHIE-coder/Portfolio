const https = require('https');
const crypto = require('crypto');

const ACCESS_TOKEN = {
    USER_ID : null,
    COMPANY_CODE : null,
    ACCESS_KEY : null,
    SECRET_KEY : null,
}

const algorithm = 'sha256';
const verboseSelections = {
    init : false,
    ready : false,
    apiRequest : false,
};

function checkAccessToken(){
    console.log(ACCESS_TOKEN);
}

function verboseModeOn(...selections) { 
    console.log('verbose mode ON');

    if(selections.includes('all')){
        verboseSelections.init = true;
        verboseSelections.ready = true;
        verboseSelections.apiRequest = true;
        console.log(verboseSelections)
        return;
    }

    for(let i = 0; i < selections.length; i++){
        switch (selections[i]) {
            case 'init':
                verboseSelections.init = true;
                break;
            case 'ready':
                verboseSelections.ready = true;
                break;
            case 'apiRequest':
                verboseSelections.apiRequest = true;
                break;
            default:
              throw new Error(`should be 'all' or 'init' or 'ready' or 'apiRequest'`)
          }
    }

    console.log(verboseSelections)
}
function verboseModeOff(isSaveSelections) { 
    console.log('verbose mode OFF');
    
    if(isSaveSelections !== true){
        verboseSelections.init = false;
        verboseSelections.ready = false;
        verboseSelections.apiRequest = false;
        console.log('all of verbose selections are cleaned');
        console.log(verboseSelections)
    }
}

async function init(initOptions){
    !verboseSelections.init || console.log(`***** init options *****`);
    !verboseSelections.init || console.log(initOptions);
    !verboseSelections.init || console.log(`************************`);
    const datetime = (new Date().toISOString().split('.')[0]+"Z").replace(/:/gi, "").replace(/-/gi, "").substring(2); 
    !verboseSelections.init || console.log(`set datetime result : ${datetime}`);
    const method = initOptions.method;
    !verboseSelections.init || console.log(`set method result : ${method}`);
    const path = initOptions.path;
    !verboseSelections.init || console.log(`set path result : ${path}`);
    const query = initOptions.query;
    !verboseSelections.init || console.log(`set query result : ${query}`);``
    const message = datetime + method + path + query;
    !verboseSelections.init || console.log(`set message result : ${message}`);
    
    return {
        ...initOptions,
        datetime : datetime,
        message : message,
        urlpath : `${path}?${query}`
    }
}

async function ready(initResults, requestBodyJson){
    !verboseSelections.ready || console.log(`***** init results *****`);
    !verboseSelections.ready || console.log(initResults);
    !verboseSelections.ready || console.log(`************************`);
    !verboseSelections.ready || console.log(`***** request body json *****`);
    !verboseSelections.ready || console.log(requestBodyJson || 'not exists');
    !verboseSelections.ready || console.log(`*****************************`);
    const signature = crypto.createHmac(algorithm, ACCESS_TOKEN.SECRET_KEY)
                    .update(initResults.message)
                    .digest('hex');
    !verboseSelections.ready || console.log(`set signature result : ${signature}`);
    const authorization = 'CEA algorithm=HmacSHA256, access-key=' + ACCESS_TOKEN.ACCESS_KEY + ', signed-date=' + initResults.datetime + ', signature=' + signature;
    !verboseSelections.ready || console.log(`set authorization result : ${authorization}`);
    const reqOptions = {
        hostname: 'api-gateway.coupang.com',
        port: 443,
        path: initResults.urlpath,
        method: initResults.method,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': authorization,
            'X-EXTENDED-TIMEOUT':10000
        }
    };
    
    if(requestBodyJson){
        reqOptions.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(requestBodyJson), 'utf8');
    }
    
    return reqOptions;
}

function apiRequest(reqOptions, requestBodyJson){
    !verboseSelections.apiRequest || console.log(`***** request options *****`);
    !verboseSelections.apiRequest || console.log(reqOptions);
    !verboseSelections.apiRequest || console.log(`***************************`);
    return new Promise((resolve, reject)=>{
        let body = [];
        
        const req = https.request(reqOptions, res  => {
            console.log(`statusCode: ${res.statusCode}`);
            console.log(`reason: ${res.statusMessage}`);

            res.on('data', (chunk) => {
                    body.push(chunk);
                    !verboseSelections.apiRequest || console.log('data(from res) push to body(arr var)');
                })
                .on('end', () => {
                    body = Buffer.concat(body).toString();
                    !verboseSelections.apiRequest || console.log('body => buffer to string');
                    const json = JSON.parse(body);
                    !verboseSelections.apiRequest || console.log('body => make json and resolve');
                    resolve(json);
                });
        });

        requestBodyJson && req.write(JSON.stringify(requestBodyJson));

        req.on('error', error => {
            console.error(error);
        });
        
        req.end();

    })
}

async function getData(initOptions, requestBodyJson){
    const initResults = await init(initOptions);
    !verboseSelections.init || console.log(` - init() result`);
    !verboseSelections.init || console.log(initResults);
    !verboseSelections.init || console.log(`--------------------`);
    const reqOptions = await ready(initResults, requestBodyJson);
    !verboseSelections.ready || console.log(` - ready() result`);
    !verboseSelections.ready || console.log(reqOptions);
    !verboseSelections.ready || console.log(`--------------------`);
    const resultJson = await apiRequest(reqOptions, requestBodyJson);
    !verboseSelections.apiRequest || console.log(` - apiRequest() result`);
    !verboseSelections.apiRequest || console.log(resultJson);
    !verboseSelections.apiRequest || console.log(`--------------------`);
    return resultJson
}

function dataPrint(json){
    console.log(JSON.stringify(json, null, 2));
}

module.exports.ACCESS_TOKEN = ACCESS_TOKEN;
module.exports.getData = getData;
module.exports.dataPrint = dataPrint;
module.exports.verboseModeOn = verboseModeOn;
module.exports.verboseModeOff = verboseModeOff;
module.exports.checkAccessToken = checkAccessToken;