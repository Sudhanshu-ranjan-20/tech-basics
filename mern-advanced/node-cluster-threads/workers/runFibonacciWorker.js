import path from "path";
import { Worker } from "worker_threads";
const __dirname = import.meta.dirname;
const __filename = import.meta.filename;

export default function runFibonacciWorker(n) {
  return new Promise((res, rej) => {
    const workerPath = path.resolve(__dirname, "fibonacci.worker.js");
    const worker = new Worker(workerPath, {
      workerData: n,
    });
    worker.on("message", (message) => res(message));
    worker.on("error", (error) => rej(error));
    worker.on("exit", (code) => {
      if (code !== 0) {
        rej(new Error("Worker exited with code ${code}"));
      }
    });
  });
}
