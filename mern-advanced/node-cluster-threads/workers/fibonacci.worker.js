import { parentPort, workerData, threadId } from "worker_threads";
import fibonacci from "../utils/fibonaaci.js";

const startedAt = Date.now();
const result = fibonacci(workerData?.n);
const durationMs = Date.now() - startedAt;

parentPort.postMessage({
  input: workerData?.n,
  result,
  durationMs,
  threadId,
});
