const express = require("express");
const soap = require("soap");
const fs = require("fs");
const path = require("path");

const app = express();

const wsdlXml = fs.readFileSync(
  path.join(__dirname, "myservice.wsdl"),
  "utf-8",
);
const serviceObject = {
  MessageSplitterService: {
    SplitterPort: {
      MessageSplitter: (args) => {
        const message = args.message || "";
        const splitter = args.splitter || ":";
        const splitArray = message.split(splitter);
        return {
          result: splitArray,
        };
      },
    },
  },
};

app.listen(8000, () => {
  soap.listen(app, "/wsdl", serviceObject, wsdlXml, () => {
    console.log("Soap Server is initialized at 8000");
  });
});
