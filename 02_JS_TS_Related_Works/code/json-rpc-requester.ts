import axios, { AxiosInstance } from "axios";


interface JsonRpcRequestParameter {
    method:string;
    params?:string[];
    id?:number;
}

interface JsonRpcResponse {
    jsonrpc:string;
    result:string;
}

interface IJsonRpcRequester {
    request(req:JsonRpcRequestParameter):Promise<JsonRpcResponse>;
}

export class JsonRpcRequester implements IJsonRpcRequester {
    private _baseURL:string;
    private _axios:AxiosInstance;

    constructor(baseURL:string){
        this._baseURL = baseURL;
        this._axios = axios.create({baseURL})
    }

    get baseURL(){
        return this._baseURL
    }

    async request(req:JsonRpcRequestParameter):Promise<JsonRpcResponse>{
        const body = { jsonrpc: "2.0", ...req};
        return (await this._axios.post("/", body)).data
    }

}
