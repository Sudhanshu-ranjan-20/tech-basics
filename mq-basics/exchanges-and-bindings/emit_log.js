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

    channel.publish(exchange, "", Buffer.from(msg));

    console.log(`SENT:: ${msg}`);
    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 5000);
  } catch (error) {}
};
main();
