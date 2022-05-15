const _ = require('lodash');
const deep_delete = require('deep-delete')

function deep_copy(obj) {
  /* Stack Overflow Issue 
    If try it on the browser console, there is no problem,
    but if try it on the node.js server, the problem will be happened.
  */
  // const clone = {};
  // for (const key in obj) {
  //   if (typeof obj[key] === "object" && obj[key] !== null) {
  //     clone[key] = deep_copy(obj[key]);
  //   } else {
  //     clone[key] = obj[key];
  //   }
  // }

  const clone = _.cloneDeep(obj);

  return clone;
}

// 메모리 객체를 전송에 적합한 객체로 변환
function db_mashal(db_object){
  const new_obj = deep_copy(db_object)
  return deep_delete(['_id','__v'], new_obj);
}

module.exports.deep_copy = deep_copy;
module.exports.db_mashal = db_mashal;