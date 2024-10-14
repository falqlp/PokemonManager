#!/bin/bash

# Créer un topic appelé "combat-simulation" avec 3 partitions
kafka-topics --create --topic test-topic --bootstrap-server kafka:9092 --partitions 3 --replication-factor 1
echo "blabla"
# Ajouter d'autres topics ici si nécessaire
