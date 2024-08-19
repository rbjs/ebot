// kafkaPublishHandler.js
module.exports = () => ({
    handle({ topic, message }) {
      console.log(`Kafka publish handler for topic "${topic}": ${message}`);
    },
  });