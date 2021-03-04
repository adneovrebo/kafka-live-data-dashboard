import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";

const server = "ws://localhost:9999/";
const topic = "random_data_stream";

type KafkaEvent = {
  message: string;
  offset: number;
}[];

type ChartData = {
  datasets: {
    label: string;
    borderColor: string;
    backgroundColor: string;
    data: { x: number; y: number }[];
  }[];
};

const data: ChartData = {
  datasets: [
    {
      label: "Live random data",
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      data: [],
    },
  ],
};

const options = {
  scales: {
    xAxes: [
      {
        type: "realtime",
        realtime: {
          delay: 5000,
        },
      },
    ],
  },
};

const App: React.FC = () => {
  useEffect(() => {
    // Create websocket connection to the correct proxy and topic
    const connection = new WebSocket(server + "?topic=" + topic);

    connection.addEventListener("open", () => {
      console.log("Opened socket to server for topic " + topic);
    });

    connection.addEventListener("error", (error) => {
      console.log(error);
    });

    connection.addEventListener("message", (event: { data: string }) => {
      const kafkaEvent: KafkaEvent = JSON.parse(event.data);
      for (let kafkaRecord of kafkaEvent) {
        const payload: { value: number; timeRecorded: number } = JSON.parse(
          kafkaRecord.message
        );
        data.datasets[0].data.push({
          x: payload.timeRecorded,
          y: payload.value,
        });
      }
    });

    // Close connection when component unmounts
    return connection.close;
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2>Live Kafka Dashboard</h2>
      <div style={{ width: "750px", height: "500px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default App;
