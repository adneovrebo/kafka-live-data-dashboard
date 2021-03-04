const kafka = require("kafka-node");
const KafkaProxy = require("kafka-proxy");

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new Producer(client);

let previousValue = 10;

producer.on("ready", function () {
  console.log("PRODUCER STARTED: Starting to send random data");
  sendMessage();
});

function sendMessage() {
  if (Math.random() > 0.5) {
    previousValue = previousValue * 1.1;
  } else {
    previousValue = previousValue * 0.9;
  }

  const payloads = [
    {
      topic: "random_data_stream",
      messages: JSON.stringify({
        value: previousValue,
        timeRecorded: Date.now(),
      }),
      partition: 0, // Partitions is a unique stream within a topic!
    },
  ];

  producer.send(payloads, function (err, data) {
    if (err) {
      console.log("Error while sending payload", err);
    } else {
      console.log("Data sent!", data);
    }
  });

  setTimeout(function () {
    sendMessage();
  }, 2000);
}

producer.on("error", function (err) {
  console.log("Error", err);
});

// Also setting up a websocket proxy for use with react. (Accessible from localhost:9999)
let kafkaProxy = new KafkaProxy({
  wsPort: 9999,
  kafka: "localhost:9092/",
});

console.log("Starting WebSocketProxy");
kafkaProxy.listen();
