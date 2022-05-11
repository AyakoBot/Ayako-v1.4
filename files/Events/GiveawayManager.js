const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
  name: 'GiveawayManager',
  async execute(client, pool) {
    const res = await pool.query('SELECT * FROM giveawaysettings;');
    if (res) {
      if (res.rows[0]) {
        res.rows.forEach(async (row) => {
          const r = row;
          const guild = client.guilds.cache.get(r.guildid);
          if (guild && guild.id) {
            const channel = client.channels.cache.get(r.channelid);
            if (channel && channel.id) {
              let description;
              if (r.requirement == 'role')
                description = `${
                  r.description
                }\n\n**Requirement:**\nYou should have the role\n${guild.roles.cache.get(
                  r.reqroleid,
                )}`;
              else if (r.requirement == 'guild') {
                if (r.invitelink)
                  description = `${r.description}\n\n**Host**\nThis Giveaway is hosted by\n[${
                    client.guilds.cache.get(r.reqserverid).name
                  }](${r.invitelink})`;
                else
                  description = `${r.description}\n\n**Host**\nThis Giveaway is hosted by\n${
                    client.guilds.cache.get(r.reqserverid).name
                  }`;
              } else description = r.description;
              const winnercount = r.winnercount;
              const endat = r.endat;
              const ended = r.ended;
              let abort = false;
              if (endat < Date.now() && ended == false) {
                const msg = await channel.messages.fetch(r.messageid).catch(() => {});
                if (msg && msg.id) {
                  const reaction = msg.reactions.cache.find((r) => r.emoji.name === '🎉');
                  let users;
                  if (reaction) {
                    await msg.guild.members.fetch();
                    users = await reaction.users.fetch();
                    users = users
                      .filter((u) => u.bot === false)
                      .filter((u) => u.id !== client.user.id)
                      .filter((u) => guild.member(u.id));
                    if (r.requirement) {
                      if (r.requirement == 'role') {
                        const role = guild.roles.cache.get(r.reqroleid);
                        if (role && role.id) {
                          users = users.filter((u) => guild.member(u.id).roles.cache.has(role.id));
                        } else {
                          const embed = new Discord.MessageEmbed()
                            .setDescription(description)
                            .setTimestamp(new Date(+endat).toUTCString())
                            .setColor('b0ff00')
                            .setAuthor(
                              'Ayako Giveaways',
                              client.user.displayAvatarURL(),
                              'https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
                            )
                            .setFooter('Ended at')
                            .addField(
                              'Giveaway cancelled, the Required Role is deleted or inaccessible\n(You can edit the Giveaway requirements in `h!giveawayedit` and then reroll the Giveaway)',
                              '\u200b',
                            );
                          msg.edit(embed).catch(() => {});
                          pool.query(
                            `UPDATE giveawaysettings SET ended = 'true' WHERE messageid = '${msg.id}';`,
                          );
                          return;
                        }
                      }
                      if (r.requirement == 'guild') {
                        const reqGuild = client.guilds.cache.get(r.reqserverid);
                        if (reqGuild && reqGuild.id) {
                          users = users.filter((u) => reqGuild.member(u.id));
                        } else {
                          const embed = new Discord.MessageEmbed()
                            .setDescription(description)
                            .setTimestamp(new Date(+endat).toUTCString())
                            .setColor('b0ff00')
                            .setAuthor(
                              'Ayako Giveaways',
                              client.user.displayAvatarURL(),
                              'https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
                            )
                            .setFooter('Ended at')
                            .addField(
                              'Giveaway cancelled, Ayako left Requirement Server\n(You can reinvite Ayako and then reroll the Giveaway)',
                              '\u200b',
                            );
                          msg.edit(embed).catch(() => {});
                          pool.query(
                            `UPDATE giveawaysettings SET ended = 'true' WHERE messageid = '${msg.id}';`,
                          );
                          return;
                        }
                      }
                    }
                    users = users
                      .random(winnercount)
                      .filter((u) => u)
                      .map((u) => guild.member(u));
                  }
                  if (abort == false) {
                    const embed = new Discord.MessageEmbed()
                      .setDescription(description)
                      .setTimestamp(new Date(+endat).toUTCString())
                      .setColor('b0ff00')
                      .setAuthor(
                        'Ayako Giveaways',
                        client.user.displayAvatarURL(),
                        'https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
                      )
                      .setFooter('Ended at');
                    if (users && users.length > 0) {
                      embed.addField('Winner(s):', users.map((w) => `<@${w.id}>`).join(', '));
                      const winnerembed = new Discord.MessageEmbed()
                        .setColor('b0ff00')
                        .setDescription(description)
                        .setFooter('End at')
                        .setTimestamp(new Date(+endat).toUTCString());
                      channel.send(
                        `Congratulations, ${users.map((w) => `<@${w.id}>`).join(', ')}! You won:`,
                        winnerembed,
                      );
                    } else {
                      embed.addField('Giveaway cancelled, no valid participations', '\u200b');
                    }
                    msg.edit(embed).catch(() => {});
                  }
                  pool.query(
                    `UPDATE giveawaysettings SET ended = 'true' WHERE messageid = '${r.messageid}';`,
                  );
                }
              }
            }
          }
        });
      }
    }
    /*async function ss() {
			const time = 1631466000000;
			const msg = await client.channels.cache.get('847481452123914310')?.messages.fetch('847486586475773982', { force: true });
			msg.embeds[0].fields = null;
			const embed = new Discord.MessageEmbed(msg.embeds[0]);
			embed.addField('Time left until start', `${moment.duration(+time - Date.now()).format(' D [days], H [hrs], m [mins], s [secs]')}`);
			msg.edit(embed);
		}*/
  },
};
