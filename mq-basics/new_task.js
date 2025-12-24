import amqplib from "amqplib";

const main = async () => {
  const queue = "TASK_QUEUE";
  let conn;

  const msg = process.argv.slice(2).join(" ") || "Hello World!";

  try {
    conn = await amqplib.connect(`amqp://admin:admin@localhost`);
    const channel = await conn.createChannel();

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });
  } catch (error) {
  } finally {
  }
};

main();
