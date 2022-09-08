import { Composer, Scenes } from "telegraf";
import { MyContext } from "../../Model/Model";
import { getList, countries } from "./GetList";
import { greeting } from "./HomeGreeting";
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project'
});

connection.connect();

require("dotenv").config();

const handler = new Composer<MyContext>(); // function
const home = new Scenes.WizardScene(
    "home",
    handler,
    async (ctx) => {

        let message = ctx.update["message"]
        if (message) {
            if (message["text"]) {
                ctx.myContextProp = message.text
                await ctx.reply("Проверьте на правильность ввода:\n <b>" + message.text + "</b>", {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    'text': 'Да',
                                    'callback_data': 'continue'
                                }
                            ],
                            [
                                {
                                    "text": 'Нет',
                                    'callback_data': 'retry'
                                }
                            ]
                        ]
                    }
                })

                ctx.wizard.next()
            }
        }

    },
    async (ctx) => {

        let update = ctx.update["callback_query"]
        console.log(update)
        if (update) {
            if (update.data) {
                if (update.data == 'continue') {

                    // update statment
                    let sql = `UPDATE project
                                SET name = ${ctx.myContextProp}
                                WHERE id = ${ctx.from?.id}`;

                    let data = [false, 1];

                    connection.query(sql, data, (error, results, fields) => {
                        if (error) {
                            return console.error(error.message);
                        }
                        console.log('Rows affected:', results.affectedRows);
                    });

                    await ctx.editMessageText('Отлично!')
                    await ctx.reply("Введите вашу почту")
                    ctx.wizard.next()
                }

                if (update.data == 'retry') {
                    await ctx.editMessageText('Введите ваше ФИО')
                    ctx.wizard.selectStep(0)
                }
            }
        }
    },

    async (ctx) => {
        let message = ctx.update["message"]

        if (message) {
            if (message["text"]) {
                await ctx.reply("Проверьте на правильность ввода:\n <b>" + message.text + "</b>", {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    'text': 'Да',
                                    'callback_data': 'continue'
                                }
                            ],
                            [
                                {
                                    "text": 'Нет',
                                    'callback_data': 'retry'
                                }
                            ]
                        ]
                    }
                })
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        let update = ctx.update["callback_query"]

        if (update) {
            if (update.data) {
                if (update.data == 'continue') {
                    await ctx.editMessageText('Ваша почта сохранена')
                    await ctx.reply("Поехали?", {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        'text': 'Да',
                                        'callback_data': 'continue'
                                    }
                                ],
                                [
                                    {
                                        "text": 'Нет',
                                        'callback_data': 'retry'
                                    }
                                ]
                            ]
                        }
                    })
                    ctx.wizard.next()
                }

                if (update.data == 'retry') {
                    await ctx.editMessageText('Введите вашу почту')
                    ctx.wizard.selectStep(ctx.session.__scenes.cursor - 1)
                }
            }
        }
    },

    async (ctx) => {
        let update = ctx.update["callback_query"]

        if (update) {
            if (update.data) {
                if (update.data == 'continue') {
                    await ctx.editMessageText('Спасибо. Ожидайте ответа.')
                } else {
                    await ctx.editMessageText('Ваш ответ принят')
                }
            }
        }
    }
);
home.leave(async (ctx) => console.log("home leave"))
home.start(async (ctx) => greeting(ctx))

handler.action('ready', async (ctx) => {

    await ctx.editMessageText('Введите ваше ФИО')
    ctx.wizard.next()
})

export default home