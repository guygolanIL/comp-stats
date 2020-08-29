import os from "os";
import { CpuSampler } from "./cpuSampler";
import { MemoryController } from "./controller/memoryController";
import {CpuController} from './controller/CpuController';

const {maxObjectsInMemory, maxIntervals} = require('../config/env.json');


const cpuController = new CpuController(maxIntervals)

export const updateCpu = (percentage: number, onDone: (activeJobs: number) => void): void => {
    console.log(`updating cpu usage to ${percentage}%`);
    cpuController.update(percentage, onDone);
};

const memoryController = new MemoryController(maxObjectsInMemory);

export const updateRam = (percentage: number, onDone: (objectInMemory: number) => void): void => {
    console.log(`updating ram usage to ${percentage}%`);
    memoryController.update(percentage, onDone);
};

export const getStats = (): { cpuUsage: number; ramUsage: number, objectsInMemory: number, activeIntervals: number } => {
    function computeMemoryUsage(): number {
        const totalMemory = os.totalmem();

        return Math.round(((totalMemory - os.freemem()) / totalMemory) * 100);
    }

    function computeAvarageCpuUsage(): number {
        const cores: os.CpuInfo[] = cpuController.getSample();

        const totalTimeOfCores = cores.reduce((accum, { times }, idx) => {
            const time = Object.values(times).reduce(
                (accum, time) => accum + time,
                0
            );
            return accum + time;
        }, 0);

        const totalIdleOfCores = cores.reduce((accum, { times }) => {
            return accum + times.idle;
        }, 0);

        const totalActiveTime = totalTimeOfCores - totalIdleOfCores;

        const totalUsageTime = totalActiveTime / totalTimeOfCores;

        const totalUsagePercentage = totalUsageTime * 100;

        const roundPercentage = Math.round(totalUsagePercentage);

        return roundPercentage;
    }

    const memUsage: number = computeMemoryUsage();
    const cpuUsage: number = computeAvarageCpuUsage();
    const objectsInMemory = memoryController.activeResources.length;
    const activeIntervals = cpuController.activeResources.length;
    return {
        cpuUsage: cpuUsage,
        ramUsage: memUsage,
        objectsInMemory,
        activeIntervals
    };
};
