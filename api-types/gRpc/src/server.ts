import fs from "fs";
import path from "path";

import { grpc, FileServiceProto, SERVER_ADDRESS } from "./grpc-setup";

const STORAGE_DIR = path.join(__dirname, "../storage");
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

const CHUNK_SIZE = 64 * 1024;

// UNARY
function listFiles(
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>,
) {
  const files = fs.readdirSync(STORAGE_DIR).map((fileName) => {
    const stats = fs.statSync(path.join(STORAGE_DIR, fileName));
    return { fileName, size: stats.size };
  });
  callback(null, { files });
}

// CLIENT STREAMING

function uploadFile(
  call: grpc.ServerReadableStream<any, any>,
  callback: grpc.sendUnaryData<any>,
) {
  let filename = "";
  let totalBytes = 0;
  const chunks: Buffer[] = [];

  call.on("data", (chunk: { filename: string; content: Buffer }) => {
    filename = chunk.filename;
    chunks.push(chunk.content);
    totalBytes += chunk.content.length;
  });

  call.on("end", () => {
    const filePath = path.join(STORAGE_DIR, filename);
    fs.writeFileSync(filePath, Buffer.concat(chunks));
    callback(null, {
      filename,
      size: totalBytes,
      success: true,
      message: `Received ${totalBytes} bytes and saved as "${filename}"`,
    });
  });
  call.on("error", (err) => {
    console.error("UPLOAD FILE STREAM ERR:::", err);
  });
}

// SERVER STREAMING

function downloadFile(call: grpc.ServerWritableStream<any, any>) {
  const { filename } = call.request;
  const filePath = path.join(STORAGE_DIR, filename);

  if (!fs.existsSync(filePath)) {
    call.destroy(new Error("file does not exists"));
    return;
  }
  const buffer = fs.readFileSync(filePath);
  for (let offset = 0; offset < buffer.length; offset += CHUNK_SIZE) {
    const content = buffer.subarray(offset, offset + CHUNK_SIZE);
    call.write({ filename, content });
  }
  call.end();
}

// Bidirectional streaming

function uploadWithProgress(call: grpc.ServerDuplexStream<any, any>) {
  let filename = "";
  let totalBytes = 0;
  const chunks: Buffer[] = [];

  call.on("data", (chunk: { filename: string; content: Buffer }) => {
    filename = chunk.filename;
    chunks.push(chunk.content);
    totalBytes += chunk.content.length;

    call.write({
      bytesRecieved: totalBytes,
      message: `Got ${chunk.content.length} more bytes (total ${totalBytes})`,
    });
  });

  call.on("end", () => {
    const filePath = path.join(STORAGE_DIR, filename);
    fs.writeFileSync(filePath, Buffer.concat(chunks));
    call.write({
      bytesReceived: totalBytes,
      message: `Done. Saved "${filename}" (${totalBytes} bytes).`,
    });
    call.end();
  });
  call.on("error", (err) => {
    console.error("uploadWithProgress stream error:", err.message);
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(FileServiceProto.service, {
    listFiles,
    uploadFile,
    downloadFile,
    uploadWithProgress,
  });
  server.bindAsync(
    SERVER_ADDRESS,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Failed to bind server:", err);
        return;
      }
      console.log(`gRPC server listening on localhost:${port}`);
      console.log(`Storing files in: ${STORAGE_DIR}`);
    },
  );
}
main();
