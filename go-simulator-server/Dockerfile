FROM golang:1.16

WORKDIR /go-simulator-server
# VARIÁVEL DE AMBIENTE
ENV PATH="/go/bin:${PATH}"

# librdkafka-dev biblioteca que permite trabalhar com o Kafka
RUN apt-get update && \
    apt-get install build-essential librdkafka-dev -y

# MANTÉM O PROCESSO ATIVO
CMD ["tail", "-f", "/dev/null"]
