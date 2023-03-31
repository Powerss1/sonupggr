const { EmbedBuilder } = require("discord.js")

module.exports = {

	name: 'sunucularım',	description: "Sunucularımı gösterir",

	cooldown: 3000,

	userPerms: [],

	botPerms: [],

	run: async (client, message, args) => {

        

        if(message.author.id === "1014980281935073331"){

    let sunucularım = []

    client.guilds.cache.forEach(x =>{

        const Embed = new EmbedBuilder()

        .setTitle(`Bulunduğum Sunucu;`)

        .setAuthor({name: `İsteyen: ${message.author.username}`, iconURL: message.author.displayAvatarURL()})

        .setDescription(

        `**Suncunun İsmi:** **\`${x.name}\`**

        **Sunucunun ID:** **\`${x.id}\`**`

        )

        .setFooter({ text: `Gönderen: ${client.user.username}`, iconURL: client.user.displayAvatarURL()})

        .setTimestamp()

        .setThumbnail(x.iconURL())

        message.channel.send({embeds: [Embed]})

       

    })

    } else { 

        message.channel.send('Bu Komut Sahibime Özel')

    }

}

}