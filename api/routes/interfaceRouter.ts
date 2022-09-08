import bot from "../../src"

require("dotenv").config()
const MongoClient = require("mongodb").MongoClient
const ObjectId = require("mongodb").ObjectId

const path = require("path")
const express = require('express')
const interfaceRouter = express.Router();

// создаем объект MongoClient и передаем ему строку подключения
const mongoClient = new MongoClient(process.env.DB_CONN_STRING);

interfaceRouter.use("/enter/greeting", async function (req, res) {
    try {
        mongoClient.connect(function (err, client) {
            if (err) {
                return res.send(err);
            }


            console.log(req.body)
            client
                .db("broker")
                .collection("bin")
                .updateOne({ id: '/start' }, { $set: req.body }, { upsert: true })

            // client
            //     .db("broker")
            //     .collection("admins")
            //     .insertOne({
            //         username: req.body.username,
            //         password: req.body.password
            //     })
            //     .then(document => res.send(document))
            //     .catch(err => res.send(err))
        });
    } catch (err) {
        console.log(err)
    }
});

interfaceRouter.use("/rules/greeting", async function (req, res) {
    try {
        mongoClient.connect(function (err, client) {
            if (err) {
                return res.send(err);
            }


            console.log(req.body)
            client
                .db("broker")
                .collection("bin")
                .updateOne({ field: 'rules', id: 'Давай попробуем' }, { $set: req.body }, { upsert: true })

            // client
            //     .db("broker")
            //     .collection("admins")
            //     .insertOne({
            //         username: req.body.username,
            //         password: req.body.password
            //     })
            //     .then(document => res.send(document))
            //     .catch(err => res.send(err))
        });
    } catch (err) {
        console.log(err)
    }
});


module.exports = interfaceRouter;