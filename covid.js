const Discord = require('discord.js');
const botRem = new Discord.Client();
const https = require('https');
const moment = require('moment')
moment.locale("th");
botRem.on('ready', () => {
    console.log('Bot Ready!');
});
botRem.on('message', message => {
    if (message.content === '-covid') {
        https.get('https://covid19.th-stat.com/api/open/today', (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                https.get('https://covid19.th-stat.com/api/open/timeline', (response) => {
                    let data_graph = "";
                    response.on('data', (s) => {
                        data_graph += s;
                    })
                    response.on('end', () => {
                        data_graph = JSON.parse(data_graph)
                        data_graph = data_graph.Data.slice(-10, data.length)

                        let arr_date = [];

                        let arr_confrimed = [];
                        let arr_recovered = [];
                        let arr_hospitalized = [];
                        let arr_deaths = [];

                        let arr_newConfirmed = [];
                        let arr_newRecovered = [];
                        let arr_newHospitalized = [];
                        let arr_newDeaths = [];

                        //date
                        for (let x = 0; x <= 9; x++) {
                            y = data_graph[x].Date.toString();
                            arr_date.push(y);
                        }

                        // old data
                        for (let x = 0; x <= 9; x++) {
                            y = data_graph[x].Confirmed
                            arr_confrimed.push(y);
                        }
                        for (let x = 0; x <= 9; x++) {
                            y = data_graph[x].Recovered
                            arr_recovered.push(y);
                        }
                        for (let x = 0; x <= 9; x++) {
                            y = data_graph[x].Hospitalized
                            arr_hospitalized.push(y);
                        }
                        for (let x = 0; x <= 9; x++) {
                            y = data_graph[x].Deaths
                            arr_deaths.push(y);
                        }

                        //new
                        for (let x = 0; x <= 9; x++) {
                            y = data_graph[x].NewConfirmed
                            arr_newConfirmed.push(y);
                        }
                        for (let x = 0; x <= 9; x++) {
                            y = data_graph[x].NewRecovered
                            arr_newRecovered.push(y);
                        }
                        for (let x = 0; x <= 9; x++) {
                            y = data_graph[x].NewHospitalized
                            arr_newHospitalized.push(y);
                        }
                        for (let x = 0; x <= 9; x++) {
                            y = data_graph[x].NewDeaths
                            arr_newDeaths.push(y);
                        }

                        var arr_date_string = "'" + arr_date.join("','") + "'";
                        console.log(arr_date_string);

                        let url = `https://quickchart.io/chart?width=500&height=300&c={type:'bar',data:{labels:[${arr_date_string}],datasets:[{label:'ติดเชื้อเพิ่ม',data:[${arr_newConfirmed}]}]}}`
                        data = JSON.parse(data);
                        const exampleEmbed = new Discord.MessageEmbed()
                            .setColor('#ae0562')
                            .setTitle('สถานการณ์ Covid-19 ')
                            .setURL('https://covid19.ddc.moph.go.th/')
                            .setDescription('วันที่ ' + moment().format('llll'))
                            .addFields(
                                { name: '\u200B', value: '\u200B' },
                                { name: ':thermometer_face: ติดเชื้อเพิ่ม', value: `${data.NewConfirmed}`, inline: true },
                                { name: ':microbe: เสียชีวิตเพิ่ม', value: `${data.NewDeaths}`, inline: true },
                                { name: ':microbe: ติดเชื้อสะสม', value: `${data.Confirmed}`, inline: true },
                                { name: ':hospital: กำลังรักษา', value: `${data.Hospitalized}`, inline: true },
                                { name: ':muscle: รักษาหาย', value: `${data.Recovered}`, inline: true },
                                { name: ':skull: เสียชีวิต', value: `${data.Deaths}`, inline: true },
                                { name: ':x: อัตราการเสียชีวิต ', value: `${((data.Deaths / data.Confirmed) * 100).toFixed(2)} %`, inline: true },
                                { name: ':white_check_mark: อัตราการรอดชีวิต ', value: `${((data.Recovered / data.Confirmed) * 100).toFixed(2)} %`, inline: true },
                                { name: '\u200B', value: '\u200B' },

                            )
                            .addFields(
                                { name: 'จำนวนการพบผู้ป่วยใหม่ (ระยะเวลา 10 วัน)', value: '\u200B' },
                            )
                            .setImage(url)
                            .setTimestamp()
                            .setFooter(`ข้อมูลโดย กรมควบคุมโรค บอทโดย aommie`);
                        message.reply(exampleEmbed);
                    })

                }).on("error", (err) => {
                    console.log(err);

                })
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });

    }

})
botRem.login('NzEwNzA5OTU5MDg3NzUxMjcw.Xr5TlA.iRcSpoS5GQmEOvBBsma50L_O8Vc');