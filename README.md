# Kafka live data dashboard

Simple dashboard consuming live data from kafka producer. Using a kafka to websocket proxy to consume in browser. The proxy is created in the producer for the sake of simplicity.

## Run application

```bash
# Run kafka with kafdrop (Kafdrop is available on localhost:9092, if running locally)
docker-compose up

# Run producer (node application, proxy is exposed on localhost:9999)
yarn producer

# Run consumer react application (localhost:3000)
yarn consumer
```
