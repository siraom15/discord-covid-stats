const Discord = require('discord.js');
const client = new Discord.Client();
const unirest = require('unirest');
const moment = require('moment');
const { token } = require('../config.json');
moment.locale("th");
client.on('ready', () => {
    console.log('Bot Running !');
    client.user.setStatus('online')
    client.user.setActivity('Bot Command >> -covid')
});
client.on('message', message => {
    if (message.content === '-covid') {
        console.log("GET CMD");
        unirest.get('https://covid19.th-stat.com/json/covid19v2/getTodayCases.json')
            .header("Accept", "application/json")
            .end((result) => {
                unirest.get('https://covid19.th-stat.com/json/covid19v2/getTimeline.json')
                    .header("Accept", "application/json")
                    .end((result2) => {
                        try {
                            
                            let data_graph = result2.body.Data
                            // console.log(data_graph);
                            let data = result.body
                            data_graph = data_graph.slice(-30, data_graph.length)

                            let arr_date = [];
                            for (let x = 0; x <= 29; x++) {
                                arr_date.push(data_graph[x].Date.toString());
                            }

                            let arr_newConfirmed = [];
                            for (let x = 0; x <= 29; x++) {
                                arr_newConfirmed.push(data_graph[x].NewConfirmed);
                            }
                            let arr_date_string = "'" + arr_date.join("','") + "'";
                            let final_date = arr_date_string.split('/2020').join('');
                            let graph_img_url = `https://quickchart.io/chart?width=500&height=300&c={type:'bar',data:{labels:[${final_date}],datasets:[{label:'ติดเชื้อเพิ่ม',data:[${arr_newConfirmed}]}]}}`

                            const exampleEmbed = new Discord.MessageEmbed()
                                .setColor('#ae0562')
                                .setTitle('สถานการณ์ Covid-19 ')
                                .setAuthor('Covid STATS by aommie', 'https://i.pinimg.com/originals/f6/b6/43/f6b6435c829d9993d425111f171e42da.jpg', 'https://discord.com/oauth2/authorize?client_id=710709959087751270&scope=bot&permissions=8')
                                .setThumbnail('https://covid19.th-stat.com/img/logoDDC.png')
                                .setDescription('ข้อมูลจากกรมควบคุมโรค')
                                .setURL('https://covid19.ddc.moph.go.th/')
                                .setDescription(moment().format('llll'))
                                .addFields(
                                    { name: '\u200B', value: '\u200B' },
                                    { name: ':thermometer_face: ติดเชื้อเพิ่ม', value: `${data.NewConfirmed}`, inline: true },
                                    { name: ':skull_crossbones: : เสียชีวิตเพิ่ม', value: `${data.NewDeaths}`, inline: true },
                                    { name: ':microbe: ติดเชื้อสะสม', value: `${data.Confirmed}`, inline: true },
                                    { name: ':hospital: กำลังรักษา', value: `${data.Hospitalized}`, inline: true },
                                    { name: ':muscle: รักษาหาย', value: `${data.Recovered}`, inline: true },
                                    { name: ':skull: เสียชีวิต', value: `${data.Deaths}`, inline: true },
                                    { name: ':x: อัตราการเสียชีวิต ', value: `${((data.Deaths / data.Confirmed) * 100).toFixed(2)} %`, inline: true },
                                    { name: ':white_check_mark: อัตราการรักษาหาย ', value: `${((data.Recovered / data.Confirmed) * 100).toFixed(2)} %`, inline: true },
                                    { name: '\u200B', value: '\u200B' },

                                )
                                .addFields(
                                    { name: 'จำนวนการพบผู้ป่วยใหม่ (ระยะเวลา 30 วัน)', value: '\u200B' },
                                )
                                .setImage(graph_img_url)
                                .setTimestamp()
                                .setFooter(`ข้อมูล : กรมควบคุมโรค`);
                            message.reply(exampleEmbed);
                            unirest.get('https://covid19.th-stat.com/json/covid19v2/getSumCases.json')
                                .header("Accept", "application/json")
                                .end((result) => {
                                    let em = {
                                        color: 0x0099ff,
                                        title: ':exclamation:  รายละเอียดการติดเชื้อ :exclamation: ',
                                        fields: [
                                            {
                                                name: '\u200b',
                                                value: '5 จังหวัดที่ติดเชื้อมากที่สุด',
                                            }
                                        ],
                                        footer: {
                                            text: `Source code: github.com/siraom15/discord-covid-stats`,
                                            icon_url: 'https://icons-for-free.com/iconfiles/png/512/part+1+github-1320568339880199515.png'
                                        },
                                    };
                                    try {
                                        let e = result.body.Province;
                                        let i = 1;
                                        for (var key in e) {
                                            if (e.hasOwnProperty(key) & i <= 5) {
                                                i++;
                                                em.fields.push({ name: key, value: e[key] + ' คน' })
                                            }
                                        }
                                        f = result.body.Gender;
                                        em.fields.push({ name: '\u200b', value: 'เพศ' })
                                        for (var key in f) {
                                            if (f.hasOwnProperty(key)) {
                                                em.fields.push({ name: key, value: f[key] + ' คน', inline: true })
                                            }
                                        }
                                        // message.reply({ embed: em });
                                    } catch (err) {
                                        console.warn(err);
                                    }

                                })
                        } catch (e) {
                            console.warn(e);
                        }
                    });
            })
    }
});

client.login(token);
