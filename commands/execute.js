/* eslint-disable */
const Discord = require('discord.js');
const moment = require('moment');
const fetch = require('node-fetch');
const ms = require('ms');
const fs = require('fs');
const { pool } = require('../files/Database.js');

module.exports = {
  name: 'execute',
  aliases: ['e'],
  Category: 'Owner',
  description: 'Used for testing purposes',
  usage: 'h!execute [variating]',
  DMallowed: 'Yes',
  async execute(msg, args, client, prefix, auth, command, logchannelid, permLevel, errorchannelID) {
    /* eslint-enable */
    if (msg.author.id == '108176076261314560') {
      const m = await client.channels.cache
        .get('847481452123914310')
        .messages.fetch('847486586475773982');
      if (m && m.id) {
        const reaction = m.reactions.cache.find((r) => r.emoji.id === '902269933860290650');
        let users;
        if (reaction) {
          users = await reaction.users.fetch();
          users = users
            .filter((u) => u.bot === false)
            .filter((u) => u.id !== client.user.id)
            .filter((u) => m.guild.member(u.id));
          users = users.map((o) => o);
          users.forEach((user) => {
            user.createDM().then((dmChannel) => {
              dmChannel
                .send(
                  "Hi!\nJust a friendly Reminder about the **Tokyo Revengers** Event You joined in __WiLLiS Gaming__\nIt's about to start!",
                )
                .catch(() => {});
            });
          });
          msg.reply(`Reminder sent to ${users.length} members`);
        }
      }
    } else {

    }
  },
};
