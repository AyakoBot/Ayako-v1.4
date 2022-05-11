const Discord = require('discord.js');
module.exports = {
  name: 'TimedManagers',
  async execute(client, pool) {
    let totalrolecount = 0;
    let totalusers = 0;
    client.guilds.cache.forEach((guild) => {
      totalrolecount = totalrolecount + guild.roles.cache.size;
      if (guild.memberCount) {
        totalusers = totalusers + guild.memberCount;
      }
    });
    pool.query(`
		UPDATE stats SET usercount = '${client.users.cache.size}';
		UPDATE stats SET guildcount = '${client.guilds.cache.size}';
		UPDATE stats SET channelcount = '${client.channels.cache.size}';
		UPDATE stats SET rolecount = '${totalrolecount}';
		UPDATE stats SET allusers = '${totalusers}';
		`);
    disboard();
    mutemanager();
    advReminder();
    votereminder();
    remindermanager();
    coolstats();
    async function advReminder() {
      const res = await pool.query('SELECT * FROM remindersadvanced;');
      if (res && res.rowCount > 0) {
        for (let i = 0; i < res.rowCount; i++) {
          const r = res.rows[i];
          const channel = await client.channels.fetch(r.channelid);
          if (channel) {
            if (r.text || r.title || r.description) {
              let webhook;
              if (r.nextdate < Date.now()) {
                if (r.webhookid) webhook = await client.fetchWebhook(r.webhookid).catch(() => {});
                let embed;
                if (r.description || r.title)
                  embed = new Discord.MessageEmbed()
                    .setTitle(r.title ? r.title.replace(/\20bg/g, "'") : null)
                    .setDescription(r.description ? r.description.replace(/\20bg/g, "'") : null)
                    .setColor(r.color ? r.color : '#b0ff00');
                else null;
                if (webhook) {
                  const body = {
                    username: r.webhookname
                      ? r.webhookname.replace(/\\20bg/g, "'")
                      : client.user.username,
                    avatarURL: r.webhookav ? r.webhookav : client.user.displayAvatarURL(),
                    content: r.text ? r.text.replace(/\\20bg/g, "'") : null,
                    embeds: [embed],
                  };
                  webhook.send(body).catch(() => {});
                } else channel.send(r.text ? r.text.replace(/\\20bg/g, "'") : null, embed);
                if (r.interval)
                  pool.query(
                    `UPDATE remindersadvanced SET nextdate = '${
                      +r.nextdate + +r.interval
                    }' WHERE channelid = '${r.channelid}' AND id = '${r.id}';`,
                  );
                else pool.query(`DELETE FROM remindersadvanced WHERE id = ${r.id};`);
              }
            }
          }
        }
        setTimeout(() => {
          for (let i = 0; i < res.rows.length; i++) {
            const r = res.rows[i];
            const j = +i + 1;
            pool.query(
              `UPDATE remindersadvanced SET id = '${j}' WHERE ${
                r.id ? `id = ${r.id} AND;`.replace(';', '') : ''
              } firstdate = ${r.firstdate} AND nextdate = ${r.nextdate} AND interval = ${
                r.interval
              };`,
            );
          }
        }, 1000);
      }
    }
    async function mutemanager() {
      const result = await pool.query("SELECT * FROM warns WHERE type = 'Mute';");
      if (result !== undefined || result.rows[0] !== undefined) {
        for (let i = 0; i < result.rowCount; i++) {
          if (result.rows[i].closed == false) {
            const guild = client.guilds.cache.get(result.rows[i].guildid);
            const user = client.users.cache.get(result.rows[i].userid);
            const end = result.rows[i].duration;
            let logchannel;
            if (guild && guild.id) {
              let logchannelid = '';
              const reslog = await pool.query(
                `SELECT * FROM logchannel WHERE guildid = '${guild.id}'`,
              );
              if (reslog && reslog.rowCount > 0) logchannelid = reslog.rows[0].modlogs;
              logchannel = client.channels.cache.get(logchannelid);
            }
            if (end < Date.now()) {
              let muteroleid;
              let muterole;
              if (guild && guild.id) {
                const res = await pool.query(
                  `SELECT muteroleid FROM muterole WHERE guildid = '${guild.id}';`,
                );
                if (res !== undefined && res.rows[0] !== undefined) {
                  muteroleid = res.rows[0].muteroleid;
                  muterole = guild.roles.cache.find((r) => r.id === muteroleid);
                } else {
                  muterole = guild.roles.cache.find((role) => role.name === 'Muted');
                }
                if (muterole) {
                  if (guild && guild.id) {
                    if (user && user.id) {
                      await guild.members.fetch(user.id).catch(() => {});
                      if (guild.member(user)) {
                        if (!guild.member(user).manageable) return;
                        var DMunmuteEmbed = new Discord.MessageEmbed()
                          .setDescription('You have been automatically unmuted.')
                          .setColor('#1aff00')
                          .setTimestamp();
                        var unmuteLogEmbed = new Discord.MessageEmbed()
                          .setTitle(`${user.username} was unmuted in the server ` + guild.name)
                          .setDescription(`${user} has been automatically unmuted`)
                          .setFooter(`Unmuted user ID: ${user.id}`)
                          .setThumbnail(user.displayAvatarURL())
                          .setTimestamp()
                          .setColor('#1aff00');
                        if (guild.member(user).roles.cache.has(muterole.id)) {
                          await guild.member(user).roles.remove(muterole);
                          if (logchannel) logchannel.send(unmuteLogEmbed).catch(() => {});
                          user.send(DMunmuteEmbed).catch(() => {});
                          pool.query(
                            `UPDATE warns SET closed = 'true' WHERE guildid = '${guild.id}' AND userid = '${user.id}' AND type = 'Mute' AND duration = '${end}';`,
                          );
                        } else
                          pool.query(
                            `UPDATE warns SET closed = 'true' WHERE guildid = '${guild.id}' AND userid = '${user.id}' AND type = 'Mute' AND duration = '${end}';`,
                          );
                      } else
                        pool.query(
                          `UPDATE warns SET closed = 'true' WHERE guildid = '${guild.id}' AND userid = '${user.id}' AND type = 'Mute' AND duration = '${end}';`,
                        );
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    async function remindermanager() {
      const resultR = await pool.query('SELECT * FROM reminders;');
      if (resultR !== undefined && resultR.rows[0] !== undefined) {
        for (let i = 0; i < resultR.rows.length; i++) {
          const text = resultR.rows[i].text;
          const duration = resultR.rows[i].duration;
          const channel = client.channels.cache.get(resultR.rows[i].channelid);
          if (channel && channel.id) {
            const guild = channel.guild;
            const user = client.users.cache.get(resultR.rows[i].userid);
            if (duration < Date.now()) {
              if (user && user.id) {
                if (guild && guild.id) {
                  if (guild.member(user)) {
                    const embed = new Discord.MessageEmbed()
                      .setDescription(`Your reminder is due!\`\`\`${text}\`\`\``)
                      .setColor('b0ff00')
                      .setTimestamp();
                    channel.send(`${user}`, embed).catch(() => {
                      user
                        .send(
                          'I tried to send a message in the channel you set the reminder in, but i failed.',
                          embed,
                        )
                        .catch(() => {});
                    });
                    pool.query(
                      `DELETE FROM reminders WHERE userid = '${user.id}' AND duration = '${duration}';`,
                    );
                  } else {
                    const embed = new Discord.MessageEmbed()
                      .setDescription(`Your reminder is due!\`\`\`${text}\`\`\``)
                      .setColor('b0ff00')
                      .setTimestamp();
                    user.send(embed).catch(() => {});
                    pool.query(
                      `DELETE FROM reminders WHERE userid = '${user.id}' AND duration = '${duration}';`,
                    );
                  }
                }
              }
            }
          }
        }
      }
      const res = await pool.query('SELECT * FROM reminders;');
      if (res !== undefined && res.rows[0] !== undefined) {
        for (let i = 0; i < res.rows.length; i++) {
          const text = resultR.rows[i].text;
          const duration = resultR.rows[i].duration;
          const channel = resultR.rows[i].channelid;
          const user = resultR.rows[i].userid;
          await pool.query(
            `UPDATE reminders SET rnr = '${i}' WHERE text = '${text.replace(
              /'/g,
              '',
            )}' AND duration = '${duration}' AND channelid = '${channel}' and user = '${user}';`,
          );
        }
      }
    }
    async function votereminder() {
      const resV = await pool.query("SELECT * FROM levelglobal WHERE reminderdone = 'false';");
      if (resV !== undefined) {
        if (resV.rows[0] !== undefined) {
          for (let i = 0; i < resV.rowCount; i++) {
            const rows = resV.rows[i];
            const userid = rows.userid;
            const reminder = rows.reminder;
            const runsoutat = rows.runsoutat;
            const votegain = rows.votegain;
            const reminderdone = rows.reminderdone;
            if (Date.now() > +reminder && reminderdone == false) {
              const user = client.users.cache.get(userid);
              const DMchannel = await user.createDM().catch(() => {});
              const reEmbed = new Discord.MessageEmbed()
                .setTitle('12 Hours are over!')
                .setDescription(
                  'If you want to keep your multiplyer streak up, ([click and vote](https://top.gg/bot/650691698409734151))\n Your multiplyer is currently ' +
                    votegain +
                    'x',
                )
                .setColor('b0ff00')
                .setTimestamp();
              DMchannel.send(reEmbed).catch(() => {});
              pool.query(
                `UPDATE levelglobal SET reminderdone = 'true' WHERE userid = '${user.id}';`,
              );
            }
            if (Date.now() > +runsoutat && reminderdone == true && votegain !== 1.0) {
              pool.query(`UPDATE levelglobal SET votegain = '1.0' WHERE userid = '${userid}';`);
            }
          }
        }
      }
    }
    async function disboard() {
      const res = await pool.query('SELECT * FROM disboard;');
      if (res && res.rowCount > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          const role = `<@&${res.rows[i].role}>`;
          const lastbump = res.rows[i].lastbump;
          const enabled = res.rows[i].enabled;
          const guild = client.guilds.cache.get(res.rows[i].guildid);
          const channel = client.channels.cache.get(res.rows[i].channelid);
          if (enabled) {
            if (+lastbump < Date.now()) {
              if (guild && guild.id) {
                if (channel && channel.id) {
                  const embed = new Discord.MessageEmbed()
                    .setDescription('You can now Bump the server again!\n\n`!d bump`')
                    .setColor('b0ff00')
                    .setTimestamp()
                    .setThumbnail(
                      guild.iconURL({
                        dynamic: true,
                        size: 512,
                        format: 'png',
                      }),
                    )
                    .setAuthor(
                      'Ayako DISBOARD Bump Reminder',
                      client.user.displayAvatarURL(),
                      'https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
                    );
                  channel.send(role, embed).catch((e) => {
                    console.log(e);
                  });
                  pool.query(`
									UPDATE disboard SET channelid = null WHERE guildid = '${guild.id}';
									UPDATE disboard SET lastbump = null WHERE guildid = '${guild.id}';
									`);
                }
              }
            }
          }
        }
      }
    }
    async function coolstats() {
      const channel = client.channels.cache.get('805839305377447936');
      const m = await channel.messages.fetch('910200917507334204').catch(() => {});
      if (m && m.id) {
        const res = await pool.query('SELECT * FROM stats;');
        let participants = 0;
        if (res.rows[0].willis) {
          participants = res.rows[0].count;
        }
        let needed = [700];
        let emote = ['', '', ''];
        for (let j = 0; j < needed.length; j++) {
          const maxparticipants = needed[j];
          const multiplier = maxparticipants / 100;
          const percent = participants / multiplier;
          let pixels = (750 / 100) * percent;
          let finish = '';
          for (let i = 1; i < 16; i++) {
            let floored = Math.floor(pixels);
            let ending;
            pixels = pixels - 50;
            if (i == 1) {
              if (floored < 1) {
                ending = '<:48:814609705838051439>';
              } else if (floored == 2 || floored == 1) {
                ending = '<:47:814609705812492289>';
              } else if (floored == 3) {
                ending = '<:47:814609705812492289>';
              } else if (floored == 4) {
                ending = '<:46:814609706097573928>';
              } else if (floored == 5) {
                ending = '<:45:814609705975808040>';
              } else if (floored == 6) {
                ending = '<:44:814609705648259114>';
              } else if (floored == 7) {
                ending = '<:43:814609705988259840>';
              } else if (floored == 8) {
                ending = '<:42:814609705976463400>';
              } else if (floored == 9) {
                ending = '<:41:814609705904111656>';
              } else if (floored == 10) {
                ending = '<:40:814609705988522034>';
              } else if (floored == 11) {
                ending = '<:39:814609705711173724>';
              } else if (floored == 12) {
                ending = '<:38:814609705883271209>';
              } else if (floored == 13) {
                ending = '<:37:814609705586262027>';
              } else if (floored == 14) {
                ending = '<:36:814609705803710474>';
              } else if (floored == 15) {
                ending = '<:35:814609705845653554>';
              } else if (floored == 16) {
                ending = '<:34:814609705812492309>';
              } else if (floored == 17) {
                ending = '<:33:814609705782476830>';
              } else if (floored == 18) {
                ending = '<:32:814609705312976928>';
              } else if (floored == 19) {
                ending = '<:31:814609705670017116>';
              } else if (floored == 20) {
                ending = '<:30:814609705706979328>';
              } else if (floored == 21) {
                ending = '<:29:814609705812885534>';
              } else if (floored == 22) {
                ending = '<:28:814609705451782165>';
              } else if (floored == 23) {
                ending = '<:27:814609705795190824>';
              } else if (floored == 24) {
                ending = '<:26:814609705774219284>';
              } else if (floored == 25) {
                ending = '<:25:814609705690202143>';
              } else if (floored == 26) {
                ending = '<:24:814609705502376007>';
              } else if (floored == 27) {
                ending = '<:23:814609705724543046>';
              } else if (floored == 28) {
                ending = '<:22:814609706890428426>';
              } else if (floored == 29) {
                ending = '<:21:814609705242066996>';
              } else if (floored == 30) {
                ending = '<:20:814609705548775464>';
              } else if (floored == 31) {
                ending = '<:19:814609705233940541>';
              } else if (floored == 32) {
                ending = '<:18:814609705263562783>';
              } else if (floored == 33) {
                ending = '<:17:814609705665691698>';
              } else if (floored == 34) {
                ending = '<:16:814609705581543464>';
              } else if (floored == 35) {
                ending = '<:15:814609705267494963>';
              } else if (floored == 36) {
                ending = '<:14:814609705452306452>';
              } else if (floored == 37) {
                ending = '<:13:814609705435529216>';
              } else if (floored == 38) {
                ending = '<:12:814609705493987378>';
              } else if (floored == 39) {
                ending = '<:11:814609705368420424>';
              } else if (floored == 40) {
                ending = '<:10:814609705128951819>';
              } else if (floored == 41) {
                ending = '<:9_:814609705371828284>';
              } else if (floored == 42) {
                ending = '<:8_:814609704936407091>';
              } else if (floored == 43) {
                ending = '<:7_:814609705297117214>';
              } else if (floored == 44) {
                ending = '<:6_:814609705271689256>';
              } else if (floored == 45) {
                ending = '<:5_:814609705246785556>';
              } else if (floored == 46) {
                ending = '<:4_:814609705287549012>';
              } else if (floored == 47) {
                ending = '<:3_:814609705237872681>';
              } else if (floored == 48) {
                ending = '<:2_:814609705049522247>';
              } else if (floored == 49) {
                ending = '<:1_:814609705191473162>';
              } else if (floored > 49) {
                ending = '<:0_:814609705196453928>';
              }
            } else if (i == 15) {
              if (floored < 1) {
                ending = '<:48:814609570445262898>';
              } else if (floored == 2 || floored == 1) {
                ending = '<:47:814609570555101224>';
              } else if (floored == 3) {
                ending = '<:47:814609570555101224>';
              } else if (floored == 4) {
                ending = '<:46:814609570403319818>';
              } else if (floored == 5) {
                ending = '<:46:814609570403319818>';
              } else if (floored == 6) {
                ending = '<:45:814609570387329084>';
              } else if (floored == 7) {
                ending = '<:44:814609570034352129>';
              } else if (floored == 8) {
                ending = '<:43:814609570420228127>';
              } else if (floored == 9) {
                ending = '<:42:814609570416558100>';
              } else if (floored == 10) {
                ending = '<:41:814609570504376331>';
              } else if (floored == 11) {
                ending = '<:40:814609570315501638>';
              } else if (floored == 12) {
                ending = '<:39:814609570563358720>';
              } else if (floored == 13) {
                ending = '<:38:814609570378416148>';
              } else if (floored == 14) {
                ending = '<:37:814609569929756754>';
              } else if (floored == 15) {
                ending = '<:36:814609570324152390>';
              } else if (floored == 16) {
                ending = '<:35:814609570987114548>';
              } else if (floored == 17) {
                ending = '<:34:814609569870250007>';
              } else if (floored == 18) {
                ending = '<:33:814609570198323211>';
              } else if (floored == 19) {
                ending = '<:32:814609570155724890>';
              } else if (floored == 20) {
                ending = '<:31:814609569837088779>';
              } else if (floored == 21) {
                ending = '<:30:814609570281422848>';
              } else if (floored == 22) {
                ending = '<:29:814609570147336252>';
              } else if (floored == 23) {
                ending = '<:28:814609570185478164>';
              } else if (floored == 24) {
                ending = '<:27:814609570085208064>';
              } else if (floored == 25) {
                ending = '<:26:814609570139078676>';
              } else if (floored == 26) {
                ending = '<:25:814609570042216458>';
              } else if (floored == 27) {
                ending = '<:24:814609570088615961>';
              } else if (floored == 28) {
                ending = '<:23:814609569765392385>';
              } else if (floored == 29) {
                ending = '<:22:814609569996472370>';
              } else if (floored == 30) {
                ending = '<:21:814609570315632680>';
              } else if (floored == 31) {
                ending = '<:20:814609570038677514>';
              } else if (floored == 32) {
                ending = '<:19:814609569925693500>';
              } else if (floored == 33) {
                ending = '<:18:814609569938538496>';
              } else if (floored == 34) {
                ending = '<:17:814609569807990826>';
              } else if (floored == 35) {
                ending = '<:16:814609569976156220>';
              } else if (floored == 36) {
                ending = '<:15:814609570038546464>';
              } else if (floored == 37) {
                ending = '<:14:814609569833418832>';
              } else if (floored == 38) {
                ending = '<:13:814609569938538517>';
              } else if (floored == 39) {
                ending = '<:12:814609569829224498>';
              } else if (floored == 40) {
                ending = '<:11:814609569707589673>';
              } else if (floored == 41) {
                ending = '<:10:814609569800126474>';
              } else if (floored == 42) {
                ending = '<:8_:814609569903804477>';
              } else if (floored == 43) {
                ending = '<:7_:814609569379647500>';
              } else if (floored == 44) {
                ending = '<:6_:814609569773912064>';
              } else if (floored == 45) {
                ending = '<:5_:814609569703264277>';
              } else if (floored == 46) {
                ending = '<:4_:814609569854259250>';
              } else if (floored == 47) {
                ending = '<:3_:814609569673248808>';
              } else if (floored == 48) {
                ending = '<:2_:814609569731969034>';
              } else if (floored == 49) {
                ending = '<:1_:814609569778237520>';
              } else if (floored > 49) {
                ending = '<:0_:814609569413464115>';
              }
            } else {
              if (floored < 19) {
                ending = '<:50:814609640566030386>';
              } else if (floored == 2 || floored == 1) {
                ending = '<:49:814609640633532467>';
              } else if (floored == 3) {
                ending = '<:48:814609640142536755>';
              } else if (floored == 4) {
                ending = '<:47:814609640519893002>';
              } else if (floored == 5) {
                ending = '<:46:814640088532516924>';
              } else if (floored == 6) {
                ending = '<:45:814609640544534528>';
              } else if (floored == 7) {
                ending = '<:44:814609640305590303>';
              } else if (floored == 8) {
                ending = '<:42:814609640453046312>';
              } else if (floored == 9) {
                ending = '<:41:814609640297201746>';
              } else if (floored == 10) {
                ending = '<:40:814609640456716288>';
              } else if (floored == 11) {
                ending = '<:39:814609640418574357>';
              } else if (floored == 12) {
                ending = '<:38:814609640310046790>';
              } else if (floored == 13) {
                ending = '<:37:814609640440201276>';
              } else if (floored == 14) {
                ending = '<:36:814609640275968041>';
              } else if (floored == 15) {
                ending = '<:35:814609640292876359>';
              } else if (floored == 16) {
                ending = '<:34:814609640373092422>';
              } else if (floored == 17) {
                ending = '<:33:814609640071233548>';
              } else if (floored == 18) {
                ending = '<:32:814609640314765332>';
              } else if (floored == 19) {
                ending = '<:31:814609640091287583>';
              } else if (floored == 20) {
                ending = '<:30:814609640041349143>';
              } else if (floored == 21) {
                ending = '<:29:814609640305983558>';
              } else if (floored == 22) {
                ending = '<:28:814609640255258634>';
              } else if (floored == 23) {
                ending = '<:27:814609640142012436>';
              } else if (floored == 24) {
                ending = '<:26:814609639970832466>';
              } else if (floored == 25) {
                ending = '<:25:814609639915257888>';
              } else if (floored == 26) {
                ending = '<:24:814609640067039252>';
              } else if (floored == 27) {
                ending = '<:23:814609640209121310>';
              } else if (floored == 28) {
                ending = '<:22:814609640095612928>';
              } else if (floored == 29) {
                ending = '<:21:814609640025096253>';
              } else if (floored == 30) {
                ending = '<:20:814609640133492796>';
              } else if (floored == 31) {
                ending = '<:19:814609639692828724>';
              } else if (floored == 32) {
                ending = '<:18:814609640004124712>';
              } else if (floored == 33) {
                ending = '<:17:814609639622312037>';
              } else if (floored == 34) {
                ending = '<:16:814609640008450148>';
              } else if (floored == 35) {
                ending = '<:15:814609639563198465>';
              } else if (floored == 36) {
                ending = '<:14:814609639680507907>';
              } else if (floored == 37) {
                ending = '<:13:814609639621525525>';
              } else if (floored == 38) {
                ending = '<:12:814609639903068160>';
              } else if (floored == 39) {
                ending = '<:11:814609639949729832>';
              } else if (floored == 40) {
                ending = '<:10:814609639911718912>';
              } else if (floored == 41) {
                ending = '<:9_:814609639891140628>';
              } else if (floored == 42) {
                ending = '<:8_:814609639676575845>';
              } else if (floored == 43) {
                ending = '<:7_:814609639957856256>';
              } else if (floored == 44) {
                ending = '<:6_:814609639827177552>';
              } else if (floored == 45) {
                ending = '<:5_:814609639806861362>';
              } else if (floored == 46) {
                ending = '<:4_:814609639399358465>';
              } else if (floored == 47) {
                ending = '<:3_:814609639664517199>';
              } else if (floored == 48) {
                ending = '<:2_:814609639580368898>';
              } else if (floored == 49) {
                ending = '<:1_:814609639793754123>';
              } else if (floored > 49) {
                ending = '<:0_:814609639832289324>';
              }
              if (ending == '<:0_:814609639832289324>') {
                emote[j] = '<:Tick:902269933860290650>';
              } else {
                emote[j] = '<a:Loading:780543908861182013>';
              }
            }
            finish += ending;
            needed[j] = finish;
          }
          let link = 'https://clik.cc/rWJMX';
          const e = new Discord.MessageEmbed()
            .setAuthor(
              'Yae Miko or 6,000 Primogems Giveaway! [You can also click here]',
              null,
              link,
            )
            .setColor('b0ff00')
            .setDescription(`Yae Miko or 6,000 Primogems Giveaway\n${needed[0]} ${emote[0]}\n`)
            .addField(
              'How to enter:',
              `<:Tick:902269933860290650> - [Download our sponsor **Hustle Castle** using my special link! **(PC DOWNLOAD)**](${link})\n (Game is available on IOS & Android but \`make sure to download from PC to be elegible for this giveaway\`)\n<:Tick:902269933860290650> - Once Downloaded on **PC** finish the tutorial. (takes 2-3 mins)\n<:Tick:902269933860290650> - Include with your screenshots your **Twitch and Discord username**\n<:Cross:902269073805701211> - Do not use old screenshots from previous giveaways\n<:Cross:902269073805701211> - Do not use old Accounts, needs to be a new Account!`,
            )
            .addField(
              '\u200b',
              'You can check if you are participating by sending \n`h!amiin` in <#336976743984267275>! \n(If you make a typo, just edit your message. I will still respond)',
            )
            .addField('Current Participants:', participants);
          if (m.embeds[0].fields[1]) {
            if (`${m.embeds[0].fields[2].value}` !== `${participants}`) m.edit(e);
          } else m.edit(e);
        }
      }
    }
  },
};
