import bot from "../../src"

require("dotenv").config()
const MongoClient = require("mongodb").MongoClient
const ObjectId = require("mongodb").ObjectId

const path = require("path")
const express = require('express')
const stepsRouter = express.Router();

// создаем объект MongoClient и передаем ему строку подключения
const mongoClient = new MongoClient(process.env.DB_CONN_STRING);

stepsRouter.use("/remove", async function (req, res) {
    try {
        return mongoClient.connect(async function (err, client) {
            if (err) {
                return res.send(err);
            }
            return await client.db("broker_dev")
                .collection("steps")
                .findOneAndDelete({
                    id: parseInt(req.body.id)
                }).then(response => {
                    console.log('Стейт удален')
                    res.send(response)
                })
                .catch(err => [
                    console.log(err)
                ])
        });
    } catch (err) {
        console.log(err)
        return false
    }
});

module.exports = stepsRouter;