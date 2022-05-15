/* 
[Named Export]
export const plus = (a, b) => a + b;
export const minus = (a, b) => a - b;
export const divide = (a, b) => a / b;

import {plus} from "./math";  //name must same
import {plus as add} from "./math";

[Default Export] -- only one per file
const plus = (a, b) => a + b;
const minus = (a, b) => a - b;
const divide = (a, b) => a / b;
export default {plus, minus, divide}

import math from "./math";
*/

export const apiRequest = function (options) {
/*  
    Parameters:
        options {
            method: String of HTTP Methods. Ex) "GET", "POST", ...
            route: String of request routes. Ex) "/api/v1/example"
            body: (Optional) Object to request.
        }

    Returns: Promise
*/
    return new Promise((resolve)=>{
        const xhr = new XMLHttpRequest();

        xhr.open(options.method, options.route);
    
        xhr.onreadystatechange = async function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                }
            }
        };
        
        const sendBody = options?.body
        if(sendBody){
            xhr.setRequestHeader("Content-Type", "application/json");
        }
        xhr.send(sendBody === undefined ? null : JSON.stringify(sendBody));
    })

}


