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