import Web3 from "web3";
import * as fs from "fs/promises";
import * as path from "path";
// NEED : "esModuleInterop": true,                             
/* Emit additional JavaScript to ease support for importing CommonJS modules. 
This enables `allowSyntheticDefaultImports` for type compatibility. */
interface ContractHandlerOptions {
    url?:string;
    contractAddress:string;
    accountAddress:string;
    abiPath:string;
    abiName:string;
}

export class ContractHandler {

    private options:ContractHandlerOptions;
    private w3:Web3;

    constructor(options:ContractHandlerOptions){
        this.options = options;
        this.w3 = new Web3(this.options?.url ?? "http://localhost:8545");
    }

    async getContract(){
        const filepath:string = path.join(this.options.abiPath, `${this.options.abiName}.json`);
        const filebuffer:Buffer = await fs.readFile(filepath);
        return new this.w3.eth.Contract(
            JSON.parse(filebuffer.toString()).abi,
            this.options.contractAddress,
            {
                from: this.options.accountAddress
            }
        )
    }
}
