import amqp from "amqplib";

const main = async () => {
  let conn;
  try {
    conn = await amqp.connect(`amqp://admin:admin@localhost`);
    const channel = await conn.createChannel();
    const queueName = "HELLO";

    channel.assertQueue(queueName, { durable: false });

    console.log("Waiting for messages in Queue");
    channel.consume(
      queueName,
      (msg) => {
        console.log(`Recieved ${msg.content.toString()}`);
      },
      { noAck: true }
    );
  } catch (error) {
  } finally {
  }
};

main();
