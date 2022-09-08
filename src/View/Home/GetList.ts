/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */

import axios from 'axios'
import fetch from "node-fetch";
import { ext_id } from './HomeGreeting';

const countries = ['US', 'AE', 'AR', 'AT', 'AU', 'BE', 'BG', 'BH', 'BR', 'CA', 'CH', 'CL', 'CN', 'CO', 'CZ', 'DE', 'DK', 'DZ', 'EG', 'ES', 'GB', 'GR', 'FI', 'FR', 'HK', 'HU', 'ID', 'IE', 'IL', 'IN', 'IT', 'JO', 'JP', 'KR', 'KW', 'LB', 'MO', 'LT', 'LV', 'MY', 'MX', 'NL', 'NO', 'NZ', 'OM', 'PH', 'PL', 'PT', 'QA', 'RO', 'RU', 'SA', 'SE', 'SG', 'SK', 'SZ', 'TH', 'TN', 'TR', 'TW', 'UA', 'VN', 'ZA']
// const countries = ['US', 'AE', 'AR', 'AT', 'RU', 'ZA']


export async function getList(id, ctx) {
    // id приложения
    let downloads = await getDownloads(id, ctx)

    if (downloads) {
        console.log(downloads)
    } else {
        console.log('no')
        return false
    }

    // получаем дату
    const nowdate = new Date(Date.now() - 86400000 * 2)
    const date = `${nowdate.getFullYear().toString()}-${(nowdate.getMonth() + 1).toString().padStart(2, '0')}-${(nowdate.getDate()).toString().padStart(2, '0')}`;

    // Временный массив    
    var results = []
    var nulledRatings = []
    // Перебираем страны
    for (let i = 0; i < countries.length; i++) {

        const options = {
            method: 'GET',
            url: `https://api.appfollow.io/api/v2/meta/ratings?ext_id=${id}&country=${countries[i].toLowerCase()}&date=${date}&type=total`,
            headers: {
                "Accept": "application/json",
                "X-AppFollow-API-Token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGl2MiIsInN1YiI6NTM2NzMsImp0aSI6NDEsInNjb3BlcyI6ImRydyJ9.4JCXQL5LZY1ihkSL_WNg-juQMMhs9k_VDfmFDxc0ZBA"
            }
        };

        // @ts-ignore
        await axios(options)
            .then(async res => {
                if (res.data.ratings.list[0]) {
                    if ((res.data.ratings.list[0].stars_total == 0)) {

                        // console.log('Need one 5 rating')
                        // console.log('Общее количество нужных звезд: 1')

                    } else if (res.data.ratings.list[0].rating <= 4.7) {
                        let item = res.data.ratings.list[0]
                        let counter = 0
                        let data = howMuchNeedAddStars(item, counter)

                        console.log(`
                            ID Приложения: ${id}\n
                            Страна       : ${countries[i].toLocaleLowerCase()}
                            Дата         : ${date}
                            Общее количество звёзд: ${item.stars_total}
                            Средний рейтинг: ${item.rating}
                            Чтобы средний рейтинг превысил 4.7 нужно долить: ${data.counter}
                        `)

                        // @ts-ignore
                        results.push(`${countries[i].toLocaleLowerCase()} — (${downloads}) — ${item.rating} — +${data.counter}`)

                    }
                } else {
                    // console.log(i + ' — is has\'t rating')
                }
            })
            .catch(err => console.log(err))


    }
    return results

}

function howMuchNeedAddStars(item, counter) {

    let total

    if (counter) {
        total = (item.stars1 + 2 * item.stars2 + 3 * item.stars3 + 4 * item.stars4 + 5 * item.stars5 * counter) / item.stars_total
    }

    console.log(total)

    let data = {
        saved: 0,
        counter
    }

    let result

    if (counter == 0) {
        data.saved = result / item.stars_total
    } else {
        result = (item.stars1 + 2 * item.stars2 + 3 * item.stars3 + 4 * item.stars4 + 5 * item.stars5 * counter) / item.stars_total
    }

    // counter += 1
    data.counter = counter

    // Если есть звезды
    if (item.stars_total) {

        // Получаем среднее значение

        // Если среднее значение меньше или равно 4.7
        if (result <= 4.7) {
            counter = counter + 1
            console.log(counter)
            return howMuchNeedAddStars(item, counter)
        } else {
            return data
        }
    } else {
        return 0
    }

}
async function getDownloads(id, ctx) {

    const nowdate = new Date(Date.now())
    let current_month = nowdate.getMonth() + 1
    let current_year = nowdate.getFullYear()

    let temp_date = new Date(Date.now() - (86400000 * 30))
    // 29, 30, 31 Последний День текущего месяца
    let lastday_of_current_month = new Date(current_year, current_month, 1)

    let to = `${current_year}-${current_month.toString().padStart(2, '0')}-${nowdate.getDate()}`
    let from = `${current_year}-${(temp_date.getMonth() + 1).toString().padStart(2, '0')}-${temp_date.getDate()}`
    // console.log('from: ' + from)
    // console.log('to: ' + to)

    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-AppFollow-API-Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGl2MiIsInN1YiI6NTM2NzMsImp0aSI6NDEsInNjb3BlcyI6ImRydyJ9.4JCXQL5LZY1ihkSL_WNg-juQMMhs9k_VDfmFDxc0ZBA'
        }
    };

    return fetch(`https://api.appfollow.io/api/v2/reports/aso?ext_id=${id}&channel=summary&from=${from}&to=${to}&period=monthly`, options)
        .then(response => response.json())
        .then(async response => {
            if (response) {
                if (response.detail) {
                    return await ctx.reply(response.detail)
                }
            }
            if (response) {
                if (response.total) {
                    console.log(response.total)
                    if (response.total[0]) {
                        if (response.total[0].units) {
                            if (response.total[0].units < 50) {
                                console.log('less than 50')
                            } else {
                                console.log(response)
                                return response.total[0].units
                            }
                        }

                    }
                }
            }
        })
        .catch(err => console.error(err));
}


export { countries }