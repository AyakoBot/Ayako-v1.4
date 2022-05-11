const Discord = require('discord.js');

const reacted = new Set();

module.exports = {
  name: 'MessageReactionAdd',
  async execute(client, msgReaction, user, pool) {
    if (!msgReaction) return;
    if (msgReaction.me) return;
    if (msgReaction.message.guild) {
      rr();
      GiveawayManager();
      willis();
    }
    return;
    async function rr() {
      const isUnicode = containsNonLatinCodepoints(msgReaction.emoji.name);
      let res;
      if (!isUnicode) {
        res = await pool.query(
          `SELECT * FROM reactionroles WHERE msgid = '${msgReaction.message.id}' AND emoteid = '${msgReaction.emoji.id}';`,
        );
      } else {
        res = await pool.query(
          `SELECT * FROM reactionroles WHERE msgid = '${msgReaction.message.id}' AND emoteid = '${msgReaction.emoji.name}';`,
        );
      }
      if (res) {
        if (res.rows[0]) {
          for (let i = 0; i < res.rowCount; i++) {
            if (msgReaction.message.channel.guild.member(user)) {
              const role = msgReaction.message.channel.guild.roles.cache.get(res.rows[i].roleid);
              if (
                !msgReaction.message.channel.guild.member(user).roles.cache.has(res.rows[i].roleid)
              ) {
                msgReaction.message.channel.guild
                  .member(user)
                  .roles.add(role)
                  .catch(() => {});
              }
            }
          }
        }
      }
    }
    async function willis() {
      if (msgReaction.message.channel.id == '805839305377447936') {
        if (
          msgReaction.message.channel.guild.member(user).roles.cache.has('278332463141355520') ||
          msgReaction.message.channel.guild.member(user).roles.cache.has('293928278845030410') ||
          msgReaction.message.channel.guild.member(user).roles.cache.has('768540224615612437') ||
          msgReaction.message.channel.guild.member(user).roles.cache.has('843862979878977647')
        ) {
          const msg = await msgReaction.message.channel.messages.fetch(msgReaction.message.id);
          msg.member = await msgReaction.message.channel.guild.members.fetch(msg.author.id);
          if (msgReaction.message.channel.guild.member(msg.author) && msg.author.id) {
            const logchannel = client.channels.cache.get('805860525300776980');
            const res = await pool.query('SELECT * FROM stats;');
            if (msgReaction.emoji.name == '✅') {
              if (reacted.has(msgReaction.message.id)) return;
              reacted.set(msgReaction.message.id);
              await msgReaction.message
                .delete()
                .then(() => reacted.delete(msgReaction.message.id))
                .catch(() => {});
              if (msg.author) {
                const embed2 = new Discord.MessageEmbed()
                  .setColor('b0ff00')
                  .setThumbnail(user.displayAvatarURL())
                  .setDescription(`${user} accepted the submission of ${msg.author}`)
                  .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                  .setTimestamp();
                const log = await logchannel.send(embed2).catch(() => {});
                if (res.rows[0].willis) {
                  if (res.rows[0].willis.includes(msg.author.id)) {
                    const embed = new Discord.MessageEmbed()
                      .setAuthor(
                        'Yae Miko or 6,000 Primogems Giveaway!',
                        null,
                        'https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
                      )
                      .setDescription('**You already entered the Giveaway!**')
                      .setColor('YELLOW')
                      .addField(
                        '\u200b',
                        '[Click here to get to the Giveaway](https://canary.discord.com/channels/108176345204264960/805839305377447936/827248223922946118)',
                      )
                      .setTimestamp();
                    await msg.author.send(embed).catch(() => {});
                    return;
                  } else {
                    const embed = new Discord.MessageEmbed()
                      .setAuthor(
                        'Yae Miko or 6,000 Primogems Giveaway!',
                        null,
                        'https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
                      )
                      .setDescription('**Your submission was accepted!**\nGood Luck!')
                      .setColor('b0ff00')
                      .addField(
                        '\u200b',
                        '[Click here to get to the Giveaway](https://canary.discord.com/channels/108176345204264960/805839305377447936/827248223922946118)',
                      )
                      .setTimestamp();
                    await msg.author.send(embed).catch(() => {});
                    let array = [];
                    array = [...new Set(res.rows[0].willis)];
                    array.push(msg.author.id);
                    const newnr = array.length;
                    pool.query(`
										UPDATE stats SET willis = ARRAY[${array}];
										UPDATE stats SET count = '${newnr}';
										`);
                  }
                } else {
                  const embed = new Discord.MessageEmbed()
                    .setAuthor(
                      'Yae Miko or 6,000 Primogems Giveaway!',
                      null,
                      'https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
                    )
                    .setDescription(
                      '**Your submission was accepted!**\nGood Luck!\n\nWinners will be picked at the End of livestream on Saturday and Sunday',
                    )
                    .setColor('b0ff00')
                    .addField(
                      '\u200b',
                      '[Click here to get to the Giveaway](https://canary.discord.com/channels/108176345204264960/805839305377447936/827248223922946118)',
                    )
                    .setTimestamp();
                  await msg.author.send(embed).catch(() => {});
                  pool.query(`
									UPDATE stats SET willis = ARRAY[${msg.author.id}];
									UPDATE stats SET count = '1';
									`);
                }
              }
            }
            if (msgReaction.emoji.name == '❌') {
              if (reacted.has(msgReaction.message.id)) return;
              reacted.set(msgReaction.message.id);
              await msgReaction.message
                .delete()
                .then(() => reacted.delete(msgReaction.message.id))
                .catch(() => {});
              if (msg.author) {
                const embed2 = new Discord.MessageEmbed()
                  .setColor('ff0000')
                  .setThumbnail(user.displayAvatarURL())
                  .setDescription(`${user} rejected the submission of ${msg.author}`)
                  .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                  .setTimestamp();
                const log = await logchannel.send(embed2).catch(() => {});
                const embed = new Discord.MessageEmbed()
                  .setAuthor(
                    'Yae Miko or 6,000 Primogems Giveaway!',
                    null,
                    'https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
                  )
                  .setDescription('**Your submission was rejected!**')
                  .addField(
                    'Please check back on the requirements',
                    '[Click here to get to the requirements](https://discord.com/channels/108176345204264960/805839305377447936/827248223922946118)',
                  )
                  .setColor('ff0000')
                  .addField(
                    '\u200b',
                    '[Click here to get to the Giveaway](https://canary.discord.com/channels/108176345204264960/805839305377447936/827248223922946118)',
                  )
                  .setTimestamp();
                await msg.author
                  .send(embed)
                  .then(() => {
                    log.react('902269933860290650');
                  })
                  .catch(() => {
                    //msgReaction.message.channel.send(`${msg.author} You did not open your DM's in time so I wasnt able to \n Though you have been re-queued. Open your DMs so I can send you the Bonus entry code next time.`).catch(() => {});
                  });
              }
            }
          }
        }
      }
    }
    function containsNonLatinCodepoints(s) {
      /* eslint-disable */
      return /[^\u0000-\u00ff]/.test(s);
      /* eslint-enable */
    }
    async function GiveawayManager() {
      if (user.id == client.user.id) return;
      let reqRole;
      let reqGuild;
      let requirement;
      let invitelink;
      let guild;
      const res = await pool.query(
        `SELECT * FROM giveawaysettings WHERE messageid = '${msgReaction.message.id}';`,
      );
      if (res) {
        if (res.rows[0]) {
          guild = client.guilds.cache.get(res.rows[0].guildid);
          requirement = res.rows[0].requirement;
          if (requirement) {
            if (requirement.includes('role')) {
              reqRole = guild.roles.cache.find((role) => role.id === res.rows[0].reqroleid);
            }
            if (requirement.includes('guild')) {
              reqGuild = client.guilds.cache.get(res.rows[0].reqserverid);
              invitelink = res.rows[0].invitelink;
            }
          }
        }
      }
      if (requirement) {
        if (requirement.includes('role')) {
          if (guild.member(user)) {
            if (!guild.member(user).roles.cache.has(reqRole.id)) {
              msgReaction.users.remove(user);
              user.createDM().then((dmChannel) => {
                const embed = new Discord.MessageEmbed()
                  .setTitle('Entry Denied')
                  .setDescription(
                    `You do not qualify for entering [this Giveaway](https://discordapp.com/channels/${msgReaction.message.guild.id}/${msgReaction.message.channel.id}/${msgReaction.message.id} "Click to view the Giveaway")`,
                  )
                  .setColor('f60909');
                dmChannel.send(embed).catch(() => {});
              });
            }
          }
        } else if (requirement.includes('guild')) {
          if (!reqGuild.member(user)) {
            user.createDM().then((dmChannel) => {
              const embed = new Discord.MessageEmbed()
                .setAuthor(
                  'Entry Accepted',
                  guild.iconURL(),
                  'https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
                )
                .setDescription(
                  `It is suggested that you join [${reqGuild.name}](${invitelink} "Click to join the server").`,
                )
                .setColor('b0ff00');
              dmChannel.send(embed).catch(() => {});
            });
          }
        }
      }
    }
  },
};
