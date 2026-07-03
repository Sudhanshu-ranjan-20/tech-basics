const soap = require("soap");
const url = "http://localhost:8000/wsdl?wsdl";

async function runClient() {
  try {
    // 1. Initialize client using the promise API
    const client = await soap.createClientAsync(url);

    const args = {
      message: "Hello:World:From:NodeJS",
      splitter: ":",
    };

    // 2. Call the promise method directly under the Service namespace
    // The library flattens the Port layer away for Async helper methods
    const [response] =
      await client.MessageSplitterService.MessageSplitterAsync(args);

    console.log("SOAP Server Response:", response);
  } catch (error) {
    console.error("Error executing SOAP request:", error.message || error);
  }
}

runClient();
