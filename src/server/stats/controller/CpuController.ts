import { AbstractResourceController } from "./AbstractResourceController";
import { CpuSampler } from "../cpuSampler";
import os from 'os';

function heavyOperation() {
    const array: number[] = [];
    const TOP_RANGE = 10000000;
    const arrSize = 3000000;
    const start = new Date().toISOString();
    for (let i = 0; i < arrSize; i++) {
        const randomInt = Math.floor((Math.random() * TOP_RANGE) + 1);
        array.push(randomInt);
    }

    array.sort();
    const end = new Date().toISOString();
}

export class CpuController extends AbstractResourceController<NodeJS.Timeout> {
    
    private _cpuSampler: CpuSampler;

    constructor(maxIntervals: number) {
        super(maxIntervals);
        this._cpuSampler = new CpuSampler(100);
    }

    protected getNewObject(): NodeJS.Timeout {
        return setInterval(() => {
            for(let i=0; i < 10; i++) {
                console.log('interval active');            
            }
        }, 1000);
    }

    protected eraseObject(object: NodeJS.Timeout): void {
        clearInterval(object);
    }

    public getSample(): os.CpuInfo[] {
        return this._cpuSampler.lastSample();
    }
}
