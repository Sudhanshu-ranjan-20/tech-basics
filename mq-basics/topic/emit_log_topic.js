import amqp from "amqplib";

const main = async () => {
  let conn;
  try {
    conn = await amqp.connect(`amqp://admin:admin@localhost`);
    const channel = await conn.createChannel();

    const exchange = "topic_logs";
    const args = process.argv.slice(2);

    const msg = args.slice(1).join(" ") || "Hello!!";
    const routingKey = args.length > 0 ? args[0] : "anonymous.info";

    channel.assertExchange(exchange, "topic", {
      durable: false,
    });

    channel.publish(exchange, routingKey, Buffer.from(msg));

    console.log(`SENT:: ${msg}`);
    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 5000);
  } catch (error) {}
};
main();
