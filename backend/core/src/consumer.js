const { Kafka } = require("kafkajs");

// Configuration du client Kafka
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });

const runConsumer = async () => {
  // Connexion au consommateur Kafka
  await consumer.connect();

  // S'abonner au topic "test-topic"
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  // Lire les messages envoyés dans le topic
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  });
};

runConsumer().catch(console.error);
