import amqp from "amqplib";

const main = async () => {
  let conn;
  try {
    conn = await amqp.connect(`amqp://admin:admin@localhost`);
    const channel = await conn.createChannel();

    const queueName = "TASK_QUEUE";
    const msg = process.argv.slice(2).join(" ") || "Hello World";
    const message = "HELLO_WORLD2!!";

    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });

    console.log(`${Date.now()} sent - ${message}`);
  } catch (error) {
  } finally {
    setTimeout(() => {
      conn.close();
    }, 5000);
  }
};

main();
