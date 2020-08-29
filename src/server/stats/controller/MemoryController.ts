const { largeObject } = require("../heavyObjectConfig.json");
import {AbstractResourceController} from './AbstractResourceController';


export class MemoryController extends AbstractResourceController<any>{
    
    
    constructor(maxSize: number) {
        super(maxSize);
    }

    protected getNewObject(){
        return { ...largeObject };
    }

    protected eraseObject(object: any): void {
        object = undefined;
    }
}
