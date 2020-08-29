import express, { Application } from "express";
import bodyParser from "body-parser";
import { getStats, updateRam, updateCpu } from "./stats/calculateStats";

const port = 4000;
const app: Application = express();
const SAMPLE_INTERVAL_MILLI = 1000;

interface IPostStatsRequest {
    type: "RAM" | "CPU";
    percentage: number;
}

interface IPostStatsResponse {
    cpu: number;
    ram: number;
    objectsInMemory?: number;
    jobsActive?: number;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let cachedCpuUsage: number;
let cachedRamUsage: number;

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
    setInterval(() => {
        const { cpuUsage, ramUsage, objectsInMemory, activeIntervals } = getStats();
        cachedCpuUsage = cpuUsage;
        cachedRamUsage = ramUsage;

        console.log(`cpu: ${cachedCpuUsage} (active intervals: ${activeIntervals}) ram: ${cachedRamUsage} (in memory: ${objectsInMemory})`);
        
    }, SAMPLE_INTERVAL_MILLI);
});

app.use(express.static("dist/public"));

app.get("/stats", (req, res) => {
    res.json({
        cpu: cachedCpuUsage,
        ram: cachedRamUsage,
    });
});

app.post("/stats", (req, res) => {
    const { percentage, type }: IPostStatsRequest = req.body;

    if (type === "RAM") {
        updateRam(percentage, (objectsInMemory: number) => {
            res.json({
                cpu: cachedCpuUsage,
                ram: cachedRamUsage,
                objectsInMemory
            });
        });
    }

    if (type === "CPU") {
        updateCpu(percentage, (activeJobs: number) => {
            res.json({
                cpu: cachedCpuUsage,
                ram: cachedRamUsage,
                activeJobs
            });
        });
    }
});
