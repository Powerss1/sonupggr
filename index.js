const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
const louritydb = require("croxydb")
const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});
// Mercy Code gelişmiş uptime botu :)
global.client = client;
client.commands = (global.commands = []);

const { readdirSync } = require("fs")
const { TOKEN } = require("./config.json");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: false,
        type: 1
    });

    console.log(`[COMMAND] ${props.name} komutu yüklendi.`)

});
readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(`[EVENT] ${name} eventi yüklendi.`)
});


client.login(TOKEN)

// Uptime Modal
const lourityModal = new ModalBuilder()
    .setCustomId('form')
    .setTitle('Link Ekle')
const u2 = new TextInputBuilder()
    .setCustomId('link')
    .setLabel('Proje Linkinizi Giriniz')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(8)
    .setMaxLength(200)
    .setPlaceholder('https://sizin-linkiniz.glitch.me')
    .setRequired(true)

const row1 = new ActionRowBuilder().addComponents(u2);
lourityModal.addComponents(row1);


const lourityModal2 = new ModalBuilder()
    .setCustomId('form2')
    .setTitle('Link Sil')
const u3 = new TextInputBuilder()
    .setCustomId('baslik1')
    .setLabel('Proje Linkini Giriniz')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(8)
    .setMaxLength(200)
    .setPlaceholder('https://sizin-linkiniz.glitch.me')
    .setRequired(true)

const row2 = new ActionRowBuilder().addComponents(u3);
lourityModal2.addComponents(row2);

// Uptime Kanala Gönderme
client.on('interactionCreate', async interaction => {

    if (interaction.commandName === "uptime-ayarla") {

        const row = new Discord.ActionRowBuilder()

            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Ekle")
                    .setStyle(Discord.ButtonStyle.Success)
                    .setCustomId("ekle")
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Sil")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("sil")
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Linklerim")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId("linklerim")
            )

        const server = interaction.guild
        let sistem = louritydb.get(`uptimeSistemi_${interaction.guild.id}`)
        if (!sistem) return;
        let channel = sistem.kanal

        const uptimeMesaj = new Discord.EmbedBuilder()
            .setColor("#4e6bf2")
            .setTitle("POWER UPTİME")
            .setDescription("***➭Hey! Sen Botunu Kaliteli ve Güvenli Bir Yerde Uptime'mi Etmek İstiyorsun O Zaman Söyleyeceklerimi Uygula!*** \n\n ✌️ » ***Botunu Uptime Etmek İçin `Ekle` Butonuna Basabilirsin, Merak Etme Nasıl Yapıldığını Butona Bastığında Göreceksin  \n\n ❤️ » Uptime Edilen Botlarının Sayısını Görmek İçin `Linklerim` Butonuna Tıklayabilirsin \n\n 🚫 » Eğer Botunu Uptimeden Kaldırmak İstiyorsan `Sil` Butonuna Tıklayabilirsin  ***")
            .setThumbnail(server.iconURL({ dynamic: true }))
            .setImage("https://discord.com/channels/1015180808111280168/1033634451227422770/1086579331507163216")
            .setFooter({ text: "Bu Hizmet POWER Uptime Tarafından Sağlanmaktadır" })
       
              interaction.guild.channels.cache.get(channel).send({ embeds: [uptimeMesaj], components: [row] })

    }

})

// Uptime Ekle
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "ekle") {

        await interaction.showModal(lourityModal);
    }
})

client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'form') {

        if (!louritydb.fetch(`uptimeLinks_${interaction.user.id}`)) {
            louritydb.set(`uptimeLinks_${interaction.user.id}`, [])
        }

        const link = interaction.fields.getTextInputValue("link")

        let link2 = louritydb.fetch(`uptimeLinks_${interaction.user.id}`, [])

        let sistem = louritydb.get(`uptimeSistemi_${interaction.guild.id}`)
        if (!sistem) return;
        let ozelrol = sistem.rol
        let log = sistem.log
        if (!log) return;
        var logChannel = client.channels.cache.get(log)

        if (!link) return;

        if (!interaction.member.roles.cache.has(ozelrol)) {
            if (louritydb.fetch(`uptimeLinks_${interaction.user.id}`).length >= 3) {
                return interaction.reply({
                    content: "En fazla 3 link ekleyebilirsin!",
                    ephemeral: true
                }).catch(e => { })
            }
        }
        // LİMİT AYARLARI BURADAN YAPILIR
        if (interaction.member.roles.cache.has(ozelrol)) {
            if (louritydb.fetch(`uptimeLinks_${interaction.user.id}`).length >= 10) {
                return interaction.reply({
                    content: "En fazla 10 link ekleyebilirsin!",
                    ephemeral: true
                }).catch(e => { })
            }
        }

        if (link2.includes(link)) {
            return interaction.reply({
                content: "Bu link zaten sistemde mevcut!",
                ephemeral: true
            }).catch(e => { })
        }

        if (!link.startsWith("https://")) {
            return interaction.reply({
                content: "Uptime linkin hatalı, lütfen başında `https://` olduğundan emin ol!",
                ephemeral: true
            }).catch(e => { })
        }

        if (!link.endsWith(".glitch.me")) {
            return interaction.reply({
                content: "Uptime linkin hatalı, lütfen sonunda `.glitch.me` olduğundan emin ol!",
                ephemeral: true
            }).catch(e => { })
        }

        if (link.includes("uptime")) {

            const logEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`<@${interaction.user.id}> adlı kullanıcı sisteme **uptime botu** eklemeye çalıştı!`)

            logChannel.send({ embeds: [logEmbed] }).catch(e => { })

            return interaction.reply({
                content: "Sistemimize uptime botu ekleyemezsin!",
                ephemeral: true
            }).catch(e => { })
        }


        louritydb.push(`uptimeLinks_${interaction.user.id}`, link)
        louritydb.push(`uptimeLinks`, link)
        interaction.reply({
            content: "Linkin başarıyla uptime sistemime eklendi!",
            ephemeral: true
        }).catch(e => { })

        const logEmbed = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription(` <@${interaction.user.id}> adlı kullanıcı sisteme bir link ekledi!\n\n *Kullanıcı ID* \n\n ${interaction.user.id} \n\n ***Bizi tercih ettiğiniz için teşekkür ederiz :)***`)

       logChannel.send({ embeds: [logEmbed] }).catch(e => { })

      client.on('guildCreate', () => {

  botCount++;

  updatePresence();

});


    }
})


// Uptime Sil
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "sil") {

        await interaction.showModal(lourityModal2);
    }
})

client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'form2') {

        let sistem = louritydb.get(`uptimeSistemi_${interaction.guild.id}`)
        if (!sistem) return;
        let log = sistem.log
        if (!log) return;
        var logChannel = client.channels.cache.get(log)

        const links = louritydb.get(`uptimeLinks_${interaction.user.id}`)
        let linkInput = interaction.fields.getTextInputValue("baslik1")

        if (!links.includes(linkInput)) return interaction.reply({ content: "Sistemde böyle bir link mevcut değil!", ephemeral: true }).catch(e => { })

        louritydb.unpush(`uptimeLinks_${interaction.user.id}`, linkInput)
        louritydb.unpush(`uptimeLinks`, linkInput)

        interaction.reply({ content: "Linkin başarıyla sistemden silindi!", ephemeral: true }).catch(e => { })

        const logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`<@${interaction.user.id}> adlı kullanıcı sistemden bir **link sildi!**\n\n *Kullanıcı ID* \n\n ${interaction.user.id} \n\n ***Daha doğrusu üzüldüm :(*** `)

        logChannel.send({ embeds: [logEmbed] }).catch(e => { })

  // botların sayısını güncelle

client.on('guildDelete', () => {

  botCount--;

  updatePresence();

});

  
    }
})

// Linklerim
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "linklerim") {

        const rr = louritydb.get(`uptimeLinks_${interaction.user.id}`)
        if (!rr) return interaction.reply({ content: "Sisteme eklenmiş bir linkin yok!", ephemeral: true })

        const links = louritydb.get(`uptimeLinks_${interaction.user.id}`).map(map => `▶️ \`${map}\` `).join("\n")

        const linklerimEmbed = new EmbedBuilder()
            .setTitle(`Uptime Linklerin`)
            .setDescription(`${links || "Sisteme eklenmiş bir link yok!"}`)
            .setFooter({ text: "POWER Uptime" })
            .setColor("Blurple")

        interaction.reply({
            embeds: [linklerimEmbed],
            ephemeral: true
        }).catch(e => { })

    }
})

client.on("ready", async () => {

    let guild = "1073846789758783549"

    let channel = "1075384932416880652"

    let message = ` ***Botun Pingi*** *_${client.ws.ping}_*`

    setInterval(async() => {

        guild = client.guilds.cache.get(guild)

        if(guild){

            channel = guild.channels.cache.get(channel)

            if(channel){

                channel.send({ content: message }).catch(e => {

                    console.log("Belirtilen Kanala Mesaj Atamıyorum!")

                })

            } else {

                console.log("Belirtilen Kanal Bulunamadı!")

            }

        } else {

            console.log("Belirtilen Sunucu Bulunamadı!")

        }

    }, 6000) //1000 = 1 saniye

})

const allowedServers = ['1073846789758783549']; // komutların kullanılmasına izin verilen sunucuların ID'lerini içeren bir dizi

client.on('interactionCreate', interaction => {

  if (!allowedServers.includes(interaction.guildId)) {

    interaction.reply('Bu komutu kullanmak için sunucuma gelmelisin!');

    return;

  }

  // buraya komutunuzun gerçekleştirilmesi için gerekli kodları ekleyin

});



client.login('MTA3MzcxNjMyMDc5NDg0OTQzMg.GoFEXH.za7k3FD-n2trj2JIylr8w_NPFCuFq9onLARVjY'); // BOT_TOKEN, Discord Developer Portal'dan aldığınız bot token'ıdır.

client.on('ready', () => {

  console.log(`Başlıyor...`);

  // Sunucu ID'si

  const guildId = '1073846789758783549';

  const guild = client.guilds.cache.get(guildId);

  if (!guild) {

    console.log(`Sunucu ID'si yanlış veya bot sunucuda değil.`);

    return;

  }

  // Kanal ID'si

  const channelId = '1076875391723110491';

  const channel = guild.channels.cache.get(channelId);

  if (!channel) {

    console.log(`Kanal ID'si yanlış veya kanal bulunamadı.`);

    return;

  }

  // Mesaj

  const message = '***Bot Uzun Zamandır*** _*0*_ ***Hata ile Aktif***';

  // Mesajı gönder

  channel.send(message);

});

client.login('MTA3MzcxNjMyMDc5NDg0OTQzMg.GoFEXH.za7k3FD-n2trj2JIylr8w_NPFCuFq9onLARVjY');

const botCount = 0;

client.on('ready', () => {

  console.log(`BotCount Hazır`);

  // botun durumunu güncelle

  client.user.setPresence({

    status: 'online',

    activities: [{

      name: `${botCount}/100 Bot Uptime ediliyor`,

      type: 'WATCHING'

    }]

  });

});

// durum güncelleme fonksiyonu

function updatePresence() {

  client.user.setPresence({

    status: 'online',

    activities: [{

      name: `${botCount}/100 Bot Uptime Ediliyor`,

      type: 'WATCHING'

    }]

  });

}

client.login('MTA3MzcxNjMyMDc5NDg0OTQzMg.GoFEXH.za7k3FD-n2trj2JIylr8w_NPFCuFq9onLARVjY');

const { MessageActionRow, MessageButton } = require('discord.js');

// Komutun açıklaması ve diğer özellikleri

module.exports = {

  name: 'öneri',

  description: 'Bot sahibine öneride bulunun',

  // Komut sadece özel mesajlarda çalışacak

  guildOnly: false,

  // Slash komutu olarak tanımlanacak

  slash: true,

  // Komutun işlevi

  async execute(interaction) {

    // Kullanıcının önerisini alınacak

    const filter = (m) => m.author.id === interaction.user.id;

    await interaction.user.send('Lütfen önerinizi girin:');

    const collected = await interaction.user.dmChannel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] });

    const suggestion = collected.first().content;

    // Kullanıcının önerisini bot sahibine iletecek

    const owner = await interaction.client.users.fetch('1014980281935073331');

    await owner.send(`**${interaction.user.username}** adlı kullanıcının önerisi: ${suggestion}`);

    // Kullanıcıya geribildirim verilecek

    await interaction.reply({ content: 'Öneriniz bot sahibine iletilmiştir. Teşekkürler!', ephemeral: true });

  },

  // Komutun slash komutuna özel işlevi

  async slashExecute(interaction) {

    // Kullanıcının özel mesajına düğme eklenecek

    const row = new MessageActionRow()

      .addComponents(

        new MessageButton()

          .setCustomId('suggestion')

          .setLabel('Öneri Gönder')

          .setStyle('PRIMARY')

      );

    await interaction.user.send({ content: 'Önerilerinizi bana özel mesaj yoluyla gönderebilirsiniz.', components: [row] });

  },

  // Düğme işlevi

  async buttonExecute(interaction) {

    // Düğme tıklaması işlencek

    if (interaction.customId === 'suggestion') {

      // Komutun "execute" işlevi çağrılacak

      await this.execute(interaction);

    }

  },

};



