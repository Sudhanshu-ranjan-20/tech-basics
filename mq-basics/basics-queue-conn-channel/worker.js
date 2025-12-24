import amqp from "amqplib";

const main = async () => {
  let conn;
  try {
    conn = await amqp.connect(`amqp://admin:admin@localhost`);
    const channel = await conn.createChannel();
    const queue = "TASK_QUEUE";

    channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (msg) => {
      var secs = msg.content.toString().split(".").length - 1;
      console.log(`MESSAGE_RECIEVED:::${msg.content.toString()}`);
      setTimeout(() => {
        console.log("DONE");
      }, secs * 1000);
    });
  } catch (error) {
  } finally {
  }
};

main();
