const jayson = require("jayson");

// Define JSON-RPC methods
const methods = {
  addNumbers: (args, cb) => {
    cb(null, args[0] + args[1]);
  },
};

// create the server

const server = new jayson.Server(methods);

server.http().listen(3000, () => {
  console.log("JSON-RPC Server is running on port 3000");
});
