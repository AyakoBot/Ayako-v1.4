const Discord = require('discord.js');
const { pool } = require('../files/Database.js');

module.exports = {
  name: 'disableprivacyandtermsreminder',
  description: 'Disables the Policy and Terms reminder',
  usage: 'h!disablePrivacyAndTermsReminder',
  requiredPermissions: 4,
  /* eslint-disable */
  async execute(msg, args, client, prefix, command, logchannelid, permLevel, errorchannelID) {
    /* eslint-enable */
    const res = await pool.query(`SELECT policyguilds FROM stats;`);
    if (res && res.rowCount && !res.rows[0].policyguilds?.includes(msg.guild.id)) {
      let sent = res.rows[0].policyguilds;
      if (!sent) sent = [];
      sent.push(msg.guild.id);
      await pool.query(`UPDATE stats SET policyguilds = $1;`, [[...new Set(sent)]]);
      msg.react('902269933860290650');
      msg.channel.send(
        'The Policy and Terms reminder is now disabled.\nPlease remember to link\nhttps://ayakobot.com/terms and https://ayakobot.com/privacy in one of your Info Channels.\nYou can re-enable the Reminder by using the same Command again.',
      );
    } else {
      const sent = res.rows[0].policyguilds;
      sent.splice(sent.indexOf(msg.guild.id), 1);
      await pool.query(`UPDATE stats SET policyguilds = $1;`, [[...new Set(sent)]]);
      msg.react('902269933860290650');
      msg.channel.send('The Policy and Terms reminder is now re-enabled');
    }
  },
};
