const Discord = require('discord.js');
const ms = require('ms');
module.exports = {
  name: 'GuildCreate',
  execute(guild, client) {
    if (!guild.memberCount) return;
    const joinembed = new Discord.MessageEmbed()
      .setDescription('<@&669894051851403294> joined a new Server')
      .addField('Server Name', guild.name, true)
      .addField('Server ID', guild.id, true)
      .addField('Membercount', guild.memberCount, true)
      .setFooter(`Ayako is now in ${client.guilds.cache.size} servers`)
      .setColor('GREEN');
    client.channels.cache
      .get('718181439354437693')
      .send(joinembed)
      .catch(() => {});
    guild.members.fetch({ withPresence: false, time: 60000 }).catch(() => {});
    const joinembed2 = new Discord.MessageEmbed()
      .setTitle('Default Prefix: `h!`')
      .setDescription('Recommended Commands you should definitely check out first:')
      .addField('`h!help setup`', 'To customize my behaviour')
      .addField('`h!help`', 'To see all of my commands')
      .addField('`h!help spez`', 'To get custom commands for your server only.')
      .addField('`h!contact` / `h!invite`', 'If you need support, use one of these commands.')
      .addField(
        'Privacy Policy and Terms of Service',
        'If you link https://ayakobot.com/terms and https://ayakobot.com/privacy\nin one of your Info channels remember to toggle the reminder by executing `h!disableprivacyandtermsreminder`',
      )
      .setColor('#b0ff00');
    if (guild.systemChannelID)
      client.channels.cache
        .get(guild.systemChannelID)
        .send(joinembed2)
        .catch(() => {});
    setTimeout(() => {
      const role = guild.roles.cache.find((role) => role.name === 'Ayako');
      if (role && role.id) {
        role.edit({ color: 'b0ff00' }).catch(() => {});
      }
    }, ms('10m'));
  },
};
