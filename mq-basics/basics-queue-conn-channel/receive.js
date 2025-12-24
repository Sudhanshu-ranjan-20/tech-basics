import amqp from "amqplib";

/*
When RabbitMq crashes or quits it will forget the queues and messages 
2 things are required to make sure that the messages arent lost 
we need to mark both queue and messages as durable
*/

const main = async () => {
  let conn;
  try {
    conn = await amqp.connect(`amqp://admin:admin@localhost`);
    const channel = await conn.createChannel();
    const queueName = "HELLO";

    channel.prefetch(1);
    // making channel to consume messages atmost 1 at a time for a queue

    channel.assertQueue(queueName, { durable: true });
    // Marking Queue as persistent even if the MQServer restarts or quits

    console.log("Waiting for messages in Queue");
    channel.consume(
      queueName,
      (msg) => {
        console.log(`Recieved ${msg.content.toString()}`);
      },
      // noAck False turns on manual acknowledgement
      //  if set to true it auto acknowledges and gets deleted from the queue
      // irrespective of the worker died or not

      { noAck: false }
    );
  } catch (error) {
  } finally {
  }
};

main();
