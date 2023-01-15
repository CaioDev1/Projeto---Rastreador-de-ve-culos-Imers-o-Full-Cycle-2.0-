package main

import (
	"fmt"
	app_producer "imersao_app/application/kafka"
	"imersao_app/infra/kafka"
	"log"

	"github.com/joho/godotenv"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("error loading .env file")
	}
}

func main() {
	msgChan := make(chan *ckafka.Message)
	consumer := kafka.NewKafkaConsumer(msgChan)

	go consumer.Consume()

	for msg := range msgChan {
		fmt.Println(string(msg.Value))
		go app_producer.Produce(msg)
	}
}
