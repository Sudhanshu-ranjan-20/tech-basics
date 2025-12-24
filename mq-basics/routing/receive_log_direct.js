import amqp from "amqplib";

const main = async () => {
  let conn;
  try {
    const args = process.argv.slice(2);
    if (!args.length) {
      console.log("Must regsiter with one of info/warning/error");
      process.exit(1);
    }
    conn = await amqp.connect(`amqp://admin:admin@localhost`);
    const channel = await conn.createChannel();

    const exchange = "direct_logs";

    channel.assertExchange(exchange, "direct", {
      durable: false,
    });

    const q = await channel.assertQueue("", { exclusive: true });

    args.forEach((severity) => {
      channel.bindQueue(q.queue, exchange, severity);
    });

    channel.consume(
      q.queue,
      (msg) => {
        console.log(
          "INFORMATION MESSAGE-->",
          msg.fields.routingKey,
          msg.content.toString()
        );
      },
      { noAck: true }
    );
  } catch (error) {}
};
main();
