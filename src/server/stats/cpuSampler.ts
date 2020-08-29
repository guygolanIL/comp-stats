import os from 'os';

export class CpuSampler {

    private _lastSample: os.CpuInfo[];
    private intervalCode: NodeJS.Timeout;


    constructor(interval: number){
        this._lastSample = os.cpus();

        this.intervalCode = setInterval(() => {
            this._lastSample = os.cpus().map(({model, speed, times}: os.CpuInfo, idx) => ({
                model,
                speed,
                times: {
                    idle: (times.idle - this._lastSample[idx].times.idle),
                    irq: (times.irq - this._lastSample[idx].times.irq),
                    nice: (times.nice - this._lastSample[idx].times.nice),
                    sys: (times.sys - this._lastSample[idx].times.sys),
                    user: (times.user - this._lastSample[idx].times.user)
                }
            }));
        }, interval);
    }

    public lastSample(): os.CpuInfo[] {
        return this._lastSample;
    }

};