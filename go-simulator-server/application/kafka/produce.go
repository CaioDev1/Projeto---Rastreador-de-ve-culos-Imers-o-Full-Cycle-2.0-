package kafka

import (
	"encoding/json"
	"imersao_app/application/route"
	"imersao_app/infra/kafka"
	"log"
	"os"
	"time"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

func Produce(msg *ckafka.Message) {
	producer := kafka.NewKafkaProducer()
	route := route.NewRoute()
	json.Unmarshal(msg.Value, &route)
	route.LoadPositions()

	positions, err := route.ExportJsonPositions()

	if err != nil {
		log.Println(err.Error())
	}

	for _, p := range positions {
		kafka.Publish(p, os.Getenv("KafkaProduceTopic"), producer)

		time.Sleep(time.Millisecond * 500)
	}
}
