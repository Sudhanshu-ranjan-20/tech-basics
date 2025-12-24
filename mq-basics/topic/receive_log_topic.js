import amqp from "amqplib";

const main = async () => {
  let conn;
  try {
    const args = process.argv.slice(2);
    if (!args.length) {
      console.log("MUST BE IN FORM <facility>.<topic>");
      process.exit(1);
    }

    conn = await amqp.connect(`amqp://admin:admin@localhost`);
    const channel = await conn.createChannel();

    const exchange = "topic_logs";

    channel.assertExchange(exchange, "topic", {
      durable: false,
    });

    const q = await channel.assertQueue("", { exclusive: true });

    args.forEach((key) => {
      channel.bindQueue(q.queue, exchange, key);
    });

    channel.consume(
      q.queue,
      (msg) => {
        console.log(
          " [x] %s:'%s'",
          msg.fields.routingKey,
          msg.content.toString()
        );
      },
      { noAck: true }
    );
  } catch (error) {}
};
main();
