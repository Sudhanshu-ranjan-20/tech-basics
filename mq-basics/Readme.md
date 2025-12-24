## EXCAHNGE-->

the producer never sends the event directly to queue
the procuder sends event to exchange
there are 4 exchanges --> fanout, direct , headers, topic
exchange recieves message from producers and sends them to queue/queues

fanout exchange is an exchange which broadcasts to all queue

logs is the exchange name
fanout is the exchange type
durable represents persistance nature

ch.assertExchange('logs', 'fanout', {durable: false})

DEFAULT EXCHANGE -->
we were able to send messages to queues and this was possible because
it was using default exchange (identified by "")

channel.sendToQueue('hello', Buffer.from('Hello World!'));

Here we use the default or nameless exchange: messages are routed to the queue
with the name specified as first parameter, if it exists.

channel.publish('logs','',Buffer.from('Hello'))
'' represents that we dont need to send the message to particular queue
we want only to publish it to our logs excahnge

TEMP QUEUES ->
we want to hear about all log messages not just subset

- interested only in currently flowing messages not the old ones

to solve that -->

1. we need a fresh empty queue whenever we connect to Rabbit
   to do this we can either create a random queue or let the server chose
   random queue for us
2. once we disconnect from the consumer , queue should also get deleted

we create a non-durable queue with a auto-generated name by -->

channel.assertQueue('',{exclusive:true})

## BINDINGS -->

we need to tell the exchange to send the message to our queue
relationship between exchange and queue is called a binding

channel.bind(queue_name,'logs','')
This can be simply read as: the queue is interested in messages from this exchange without any key.(IF KEY ALSO GIVEN AND THE EXCHANGE IS FANOUT IT WILL IGNORE THE KEY AS ITS BINDING TO FANOUT EXCHANGE)

## DIRECT EXCHANGE

Fanout dont give much flexibility its only capable of mindless broadcasting.
In direct exchange, message goes to the queue whose binding key excatly matches the routing key

![EXAMPLE --> ](image.png)
