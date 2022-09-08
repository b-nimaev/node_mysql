import { MyContext } from "../../Model/Model"
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project'
});

connection.connect();

let createTodos = `create table if not exists users(
                          id int primary key auto_increment,
                          name varchar(255)not null,
                          email varchar(255)not null,
                          ready tinyint(1) not null default 0,
                          field varchar(255)not null
                      )`;
connection.query(createTodos, function (err, result) {
    if (err) throw err;
    console.log("Table created");
});


export async function greeting(ctx: MyContext) {

    let extra = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Готов',
                        callback_data: 'ready'
                    }
                ]
            ]
        }
    }
    await connection.query(`INSERT INTO users (id, name, email, ready, field) VALUES (${ctx.from?.id}, "", "", 0, "") ON DUPLICATE KEY UPDATE()`, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
    });

    console.log(ctx.from?.id)
    // console.log(extra.reply_markup.inline_keyboard)
    // @ts-ignore
    ctx.reply("Здравствуйте, подтвердите готовность!", extra)

}