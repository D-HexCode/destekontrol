const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES], partials: ["CHANNEL"] });

var deckslots = [];
var logs = '';
var prefix = '$$';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    logs += 'Bot çalışıyor: ' + getTimeForLogs() + '\n';
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    var splits = message.content.split(' ');
    
    if (splits[0] == prefix+'desteat') {
        if (!message.attachments.first()) {
            message.channel.send('Bir resim eklemedin!');
            return;
        }
        if (splits[1] != 'main' && splits[1] != 'extra' && splits[1] != 'side') {
            message.channel.send('Deste parametresi geçersiz!');
            return;
        }
        for (i=0; i<deckslots.length; i++) {
            if (deckslots[i][0] == message.author.id) {
                if (splits[1] == 'main') {
                    deckslots[i][1] = message.attachments.first().url;
                }
                if (splits[1] == 'extra') {
                    deckslots[i][2] = message.attachments.first().url;
                }
                if (splits[1] == 'side') {
                    deckslots[i][3] = message.attachments.first().url;
                }
                logs += message.author.username + ' ' + splits[1] +': ' + getTimeForLogs() + '\n';
                message.channel.send('Turnuva destelerin güncellendi.');
                return;
            }
        }
        var arrnew = [message.author.id, '', '', ''];
        if (splits[1] == 'main') {
            arrnew[1] = message.attachments.first().url;
        }
        if (splits[1] == 'extra') {
            arrnew[2] = message.attachments.first().url;
        }
        if (splits[1] == 'side') {
            arrnew[3] = message.attachments.first().url;
        }
        deckslots.push(arrnew);
        logs += message.author.username + ' ' + splits[1] +': ' + getTimeForLogs() + '\n';
        message.channel.send('Turnuva katılımın oluşturuldu.');
    }

    if (splits[0] == prefix+'desteal') {
        if (!message.mentions.users.first()) { // Komut mention içermiyorsa
            for (i=0; i<deckslots.length; i++) {
                if (message.author.id == deckslots[i][0]) { // Kendi destesi var
                    if (deckslots[i][1] != '') message.channel.send('Main deck: \n'+deckslots[i][1]);
                    if (deckslots[i][2] != '') message.channel.send('Extra deck: \n'+deckslots[i][2]);
                    if (deckslots[i][3] != '') message.channel.send('Side deck: \n'+deckslots[i][3]);
                    return;
                }
            }
            message.channel.send('Bir deste yüklememiş görünüyorsun.'); // Kendi destesi yok
            return;
        } else { // Komut mention içeriyorsa
            if (message.guild == null) { // DM içinde
                if (message.mentions.users.first().id != message.author.id) {
                    message.channel.send('DM\'den ancak kendi desteni görebilirsin!');
                    return;
                } else {
                    for (i=0; i<deckslots.length; i++) {
                        if (message.author.id == deckslots[i][0]) { // Kendi destesi var
                            if (deckslots[i][1] != '') message.channel.send('Main deck: \n'+deckslots[i][1]);
                            if (deckslots[i][2] != '') message.channel.send('Extra deck: \n'+deckslots[i][2]);
                            if (deckslots[i][3] != '') message.channel.send('Side deck: \n'+deckslots[i][3]);
                            return;
                        }
                    }
                    message.channel.send('Bir deste yüklememiş görünüyorsun.'); // Kendi destesi yok
                    return;
                }
            } else { // Sunucu içinde
                if (message.mentions.users.first().id != message.author.id) {
                    if (message.member.roles.cache.has('597574403441688587')) {
                        message.channel.send('Yetkili izni.');
                    } else {
                        message.channel.send('Ancak kendi desteni görebilirsin!');
                        return;
                    }
                }
                for (i=0; i<deckslots.length; i++) {
                    if (message.mentions.users.first().id == deckslots[i][0]) {
                        if (deckslots[i][1] != '') message.channel.send('Main deck: \n'+deckslots[i][1]);
                        if (deckslots[i][2] != '') message.channel.send('Extra deck: \n'+deckslots[i][2]);
                        if (deckslots[i][3] != '') message.channel.send('Side deck: \n'+deckslots[i][3]);
                        return;
                    }
                }
                message.channel.send('Bir destesi görünmüyor.');
                return;
            }
        }
    }

    if (splits[0] == prefix+'desteler') {
        if (message.guild == null) {
            message.channel.send('Bu komut DM mesajlarında kullanılamaz!');
            return;
        }
        var mesg = 'Deste gönderen sayısı: ' + deckslots.length;
        for (i=0; i<deckslots.length; i++) {
            if (!message.guild.members.fetch(deckslots[i][0])) {
                mesg += '\n' + deckslots[i][0];
            } else {
                var uname = (await message.guild.members.fetch(deckslots[i][0])).user.username;
                mesg += '\n' + uname;
            }
            if (deckslots[i][1] == '') mesg += ' m:-';
            else mesg += ' m:+';
            if (deckslots[i][2] == '') mesg += ' e:-';
            else mesg += ' e:+';
            if (deckslots[i][3] == '') mesg += ' s:-';
            else mesg += ' s:+';
        }
        message.channel.send(mesg);
    }
  
    if (splits[0] == prefix+'logs') {
        var dcMaxCharLimit = 1800;
        var loggi = Math.floor(logs.length / dcMaxCharLimit);
        for (i=0; i<loggi; i++) {
            message.channel.send(logs.substring(dcMaxCharLimit*i, dcMaxCharLimit*(i+1)));
        }
        message.channel.send(logs.substring(dcMaxCharLimit*loggi, logs.length));
    }

    if (splits[0] == prefix+'author') {
        message.channel.send('HexCode#3764 tarafından kodlandım.');
    }
    
    if (splits[0] == prefix+'github') {
        message.channel.send('https://github.com/D-HexCode/destekontrol');
    }
});

function getTimeForLogs(){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours() + 3;
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
}

client.login(process.env.BOT_TOKEN);
