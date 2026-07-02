const soap = require("soap");
const url = "http://localhost:8000/wsdl?wsdl";

async function runClient() {
  try {
    // 1. Create the SOAP client
    const client = await soap.createClientAsync(url);

    console.log("CLIENT_DATA::", Object.keys(client));

    const args = {
      message: "Hello:World:From:NodeJS",
      splitter: ":",
    };

    // 2. Call the method directly off the client object
    // node-soap exposes root promise methods by appending 'Async'
    const [response] = await client.MessageSplitterService(args);

    console.log("SOAP Server Response:", response);
  } catch (error) {
    console.error("Error executing SOAP request:", error);
  }
}

runClient();
