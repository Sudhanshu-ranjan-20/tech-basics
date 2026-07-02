import { log } from "console";
import express from "express";
import os, { platform } from "os";
import fibonacci from "../utils/fibonaaci.js";
import runFibonacciWorker from "../workers/runFibonacciWorker.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "CLUSTER - THREADS - PM2 lab",
    pid: process.pid,
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    pid: process.pid,
    platform: os.platform,
    cpuCount: os.cpus().length,
    uptime: process.uptime(),
  });
});
app.get("/pid", (req, res) => {
  res.json({
    status: "OK",
    pid: process.pid,
    ppid: process.ppid,
    memoryUsage: process.memoryUsage(),
  });
});

app.get("/fib/:n", (req, res) => {
  const n = Number.parseInt(req?.params?.n || 40);
  const start = Date.now();
  const result = fibonacci(n);
  const duration = Date.now() - start;
  res.json({
    input: n,
    pid: process.pid,
    duration,
    result,
    warning: "THIS ENDPOINT BLOCKS EVENT LOOP",
  });
});
app.get("/fib-t/:n", async (req, res, next) => {
  const n = Number.parseInt(req?.params?.n || 40);
  const start = Date.now();
  const result = await runFibonacciWorker(n);
  const duration = Date.now() - start;
  res.json({
    ...result,
    mainProcessId: process.pid,
    duration,
    warning: "THIS ENDPOINT IS PROCESSED IN WORKER THREAD...",
  });
});

app.listen(PORT, () => {
  log(`SERVER LISTENING AT http://localhost:${PORT}`);
  log(`PROCESS PID: ${process.pid}`);
});
