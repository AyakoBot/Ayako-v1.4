const ms = require('ms');

module.exports = {
  name: 'Disboardmsg',
  async execute(msg, pool) {
    if (msg.author.id == '302050872383242240') {
      if (
        msg.embeds &&
        msg.embeds[0] &&
        msg.embeds[0].color == '2406327' &&
        msg.embeds[0].image?.url?.endsWith('bot-command-image-bump.png')
      ) {
        const res = await pool.query(`SELECT * FROM disboard WHERE guildid = '${msg.guild.id}';`);
        if (res) {
          if (res.rows[0]) {
            if (res.rows[0].enabled) msg.react('<:Tick:902269933860290650>').catch(() => {});
            pool.query(`
						UPDATE disboard SET lastbump = '${Date.now() + ms('120m')}' WHERE guildid = '${msg.guild.id}';
						UPDATE disboard SET channelid = '${msg.channel.id}' WHERE guildid = '${msg.guild.id}';
						`);
          }
        }
      }
    }
  },
};
