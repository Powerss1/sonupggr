const { MessageEmbed } = require('discord.js');

module.exports = {

  name: 'yardım',

  description: 'Tüm komutları gösterir',

  async execute(interaction) {

    console.log('yardım komutu çalıştırıldı!');

    const embed = new MessageEmbed()

      .setColor('#0099ff')

      .setTitle('***POWER UPTIME***')

      .setDescription('Aşağıda tüm mevcut komutlar listelenmektedir:')

      .addField('*_/uptime-ayarla_*', 'Uptime sistemini ayarlarsınız.')

      .addField('*_/sunucularım_*', 'Bulunduğum sunucuları görürsünüz *_Geliştirici Özel!_*')

      .addField('*_/yardım_*', 'Tüm komutlarımı gösterir.')

      .addField('*** 📂 Geliştirici Duyuruları ***', 'Duyuru bulunmuyor.')

      // Burada mevcut tüm komutları ekleyebilirsiniz.

    try {

      await interaction.reply({ embeds: [embed] });

    } catch (error) {

      console.error(error);

    }

  },

};

