import amqplib from "amqplib";

const main = async () => {
  const queue = "TASK_QUEUE";
  let conn;

  const msg = process.argv.slice(2).join(" ") || "Hello World!";

  try {
    conn = await amqplib.connect(`amqp://admin:admin@localhost`);
    const channel = await conn.createChannel();

    // making queue as durable as to mark the queue not to delete
    // when MQ is restarted or crashed

    await channel.assertQueue(queue, { durable: true });

    // making message as persistent so that the messages are not lost
    //marking message as persistent writes messages to disk

    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });
  } catch (error) {
  } finally {
  }
};

main();
