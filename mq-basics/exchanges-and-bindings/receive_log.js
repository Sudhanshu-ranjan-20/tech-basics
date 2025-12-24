import amqp from "amqplib";

const main = async () => {
  let conn;
  try {
    conn = await amqp.connect(`amqp://admin:admin@localhost`);
    const channel = await conn.createChannel();

    const exchange = "logs";

    const msg = process.argv.slice(2).join(" ") || "Hello!!";

    channel.assertExchange(exchange, "fanout", {
      durable: false,
    });

    const q = await channel.assertQueue("", { exclusive: true });

    console.log("Waiting for messages in", q.queue);
    channel.bindQueue(q.queue, exchange, "");

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) console.log(msg.content.toString());
      },
      { noAck: true }
    );
  } catch (error) {}
};
main();
