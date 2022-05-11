const Discord = require('discord.js');
const { pool } = require('../Database.js');
module.exports = {
  name: 'GuildMemberAdd',
  async execute(msg, client) {
    termsNote(msg);
    welcome();
    GiveawayManager();
    if (msg.guild.id == '96829545109266432')
      msg.roles.add('898234189437075517').catch(() => {}),
        msg.roles.add('898233767548842036').catch(() => {});
    if (msg.guild.id == '793137360711450624') {
      msg.guild
        .member(msg.user)
        .roles.add('795617231244886066')
        .catch(() => {});
    }
    if (msg.guild.id == '366219406776336385') {
      const embed = new Discord.MessageEmbed()
        .setDescription(
          `<a:Wave4:711645667118022779> **Welcome ${msg.user} to Gameverse!**\n\nPlease read <#366239248900292618> and drop a hello in <#775816426082664449>!\n\n<a:AMpikaowo:707731786800693390> Also join our friendly anime & art server: https://www.discord.gg/animekos`,
        )
        .addField(
          '<:Boost1:748294124150718494>**Boost us for access to special giveaways~**',
          '<:AMayakopeek:924071140257841162> Invite Ayako to your server: [Invite](https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands)',
        )
        .setColor('b0ff00');
      msg.user
        .createDM()
        .then((dmChannel) => {
          dmChannel.send(embed).catch(() => {});
        })
        .catch(() => {});
    }
    if (msg.guild.id == '298954459172700181') {
      const channel = client.channels.cache.get('317410162061344768');
      const m = await channel
        .send(`${msg.user.username} has joined! <a:Wave:775409859339747349>`)
        .catch(() => {});
      m.edit(`${msg.user} has joined! <a:Wave:775409859339747349>`).catch(() => {});
    }
    if (msg.guild.id == '366219406776336385') {
      client.channels.cache
        .get('371033911394041857')
        .send(`${msg.user.tag} has joined ${msg.guild.name}!`)
        .then((m) => {
          m.edit(`${msg.user} has joined ${msg.guild.name}!`);
        })
        .catch(() => {});
    }
    const res = await pool.query(
      `SELECT * FROM warns WHERE closed = 'false' AND type = 'Mute' AND guildid = '${msg.guild.id}' AND userid = '${msg.user.id}' AND closed = null;`,
    );
    let Muterole;
    if (res !== undefined) {
      if (res.rows[0] !== undefined) {
        const resM = await pool.query(`SELECT * FROM muterole WHERE guildid = '${msg.guild.id}';`);
        if (resM !== undefined) {
          if (resM.rows[0] !== undefined) {
            Muterole = msg.guild.roles.cache.find((r) => r.id == resM.rows[0].muteroleid);
          } else {
            Muterole = msg.guild.roles.cache.find((r) => r.name.toLowerCase() == 'muted');
          }
          if (!msg.guild.member(msg.user).roles.cache.has(Muterole.id)) {
            msg.guild
              .member(msg.user)
              .roles.add(Muterole)
              .catch(() => {});
          }
        }
      }
    }
    const res2 = await pool.query(
      `SELECT * FROM warns WHERE type = 'Mute' AND duration = null AND userid = '${msg.user.id}' AND guildid = '${msg.guild.id}';`,
    );
    if (res2 !== undefined) {
      if (res2.rows[0] !== undefined) {
        const resM = await pool.query(`SELECT * FROM muterole WHERE guildid = '${msg.guild.id}';`);
        if (resM !== undefined) {
          if (resM.rows[0] !== undefined) {
            Muterole = msg.guild.roles.cache.find((r) => r.id == resM.rows[0].muteroleid);
          } else {
            Muterole = msg.guild.roles.cache.find((r) => r.name.toLowerCase() == 'muted');
          }
          if (!msg.guild.member(msg.user).roles.cache.has(Muterole.id)) {
            msg.guild
              .member(msg.user)
              .roles.add(Muterole)
              .catch(() => {});
          }
        }
      }
    }
    async function welcome() {
      const res3 = await pool.query(`SELECT * FROM welcome WHERE guildid = '${msg.guild.id}';`);
      if (res3) {
        if (res3.rowCount !== 0) {
          const result = res3.rows[0];
          if (result.enabledtof == true) {
            const channel = msg.guild.channels.cache.get(result.channelid);
            if (channel && channel.id) {
              if (!result.text) {
                result.text = `Hi %i205 <a:Wave4:711645667118022779>\nWelcome to ${msg.guild.name}~\nFell free to look around <:comfy:759895974159843338>`;
              }
              result.text = result.text
                .replace(/%u205/g, "'")
                .replace(/%o205/g, '`')
                .replace(/%i205/g, `${msg.user}`);
              const embed = new Discord.MessageEmbed()
                .setDescription(`${result.text.toString()}`)
                .setColor(result.color.toUpperCase());
              if (result.imageurl !== null) {
                embed.setImage(`${result.imageurl}`);
              }
              if (result.pingtof == true) {
                channel.send(`${msg.user}`, embed).catch(() => {});
              } else {
                channel.send(embed).catch(() => {});
              }
            }
          }
        }
      }
    }
    async function GiveawayManager() {
      let guild;
      let reqGuild;
      let requirement;
      let invitelink;
      let channelid;
      let messageid;
      pool.query(
        `SELECT * FROM giveawaysettings WHERE reqserverid = '${msg.guild.id}';`,
        (err, result) => {
          const restext = `${result.rows[0]}`;
          if (restext == 'undefined') {
            return;
          } else {
            requirement = result.rows[0].requirement;
            if (requirement.includes('guild')) {
              reqGuild = client.guilds.cache.get(result.rows[0].reqserverid);
              invitelink = result.rows[0].invitelink;
            }
            guild = client.guilds.cache.get(result.rows[0].guildid);
            channelid = result.rows[0].channelid;
            messageid = result.rows[0].messageid;
            finish(guild, reqGuild, invitelink, channelid, messageid);
          }
        },
      );
    }
    function finish(guild, reqGuild, invitelink, channelid, messageid) {
      if (!channelid) return;
      const channel = client.channels.cache.get(channelid);
      if (channel) {
        channel.messages.fetch(messageid).then((m) => {
          const allReactions = m.reactions.cache.first().users.cache.map((u) => u.id);
          if (allReactions.includes(msg.user.id)) {
            msg.user
              .createDM()
              .then((dmChannel) => {
                const embed = new Discord.MessageEmbed()
                  .setTitle(`You joined ${reqGuild.name}`)
                  .setDescription(
                    `You will now be able to claim your prize in [${guild.name}](https://discordapp.com/channels/${guild.id}/${channelid}/${messageid} "Click to view giveaway") if you win.`,
                  )
                  .setColor('b0ff00');
                dmChannel.send(embed).catch(() => {});
              })
              .catch(() => {});
          }
        });
      }
    }
  },
};

const termsNote = async (member) => {
  const res = await pool.query(`SELECT * FROM stats;`);
  if (!res || !res.rowCount) return;

  if (res.rows[0].policyannouncementsentto?.includes(member.user.id)) return;
  if (res.rows[0].policyguilds?.includes(member.guild.id)) return;

  const embed = new Discord.MessageEmbed()
    .setAuthor(
      `As per Discord Developer Terms of Service I'm required to tell you`,
      null,
      'https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
    )
    .setTitle(`Welcome to ${member.guild.name}`)
    .setDescription(
      `This Server uses Ayako (and possibly the Ayako Beta Version) for some features and/or services.\n\n` +
        `**Terms of Service** https://ayakobot.com/terms\nViolation of any of these Terms can lead to your access to Ayako being revoked.\n\n` +
        `**Privacy Policy** https://ayakobot.com/privacy\nAyako will never share or store sensitive Data or Information about you outside of Discord and outside the Discord Server you sent them in.`,
    )
    .addField(
      'Premium',
      "Ayako's Service is completely free and will stay free.\nHowever, I do appreciate\nDonations on https://www.patreon.com/Lars_und_so and\nVotes on https://top.gg/bot/650691698409734151/vote",
    )
    .addField(
      'Support',
      'If you have Questions or would like your Stored Data to be deleted, join the Discord Server linked to this Message and use this Channel: <#827302309368561715>',
    )
    .addField(
      'Invite',
      'You can Invite Ayako to your Server using this link: https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
    )
    .addField(
      'Opt-out',
      "You can opt-out of Ayako's features and logging by leaving every Mutual Server with Ayako",
    )
    .addField(
      'Disabling this Reminder',
      'Server Managers can disable this Reminder with the command `h!disablePrivacyAndTermsReminder`. However we ask you to link both, the /terms and the /privacy, URLs in one of your Info Channels if you do that.',
    )
    .setColor('b0ff00');

  const m = await member.user
    .send({ embed, content: 'Ayako Terms and Privacy Notice' })
    .catch(() => {});
  m?.edit({
    embed,
    content: 'This Reminder will only be sent to you __once__\nhttps://discord.gg/GNpcspBbDr',
  });

  if (res && res.rowCount) {
    let sent = res.rows[0].policyannouncementsentto;
    if (!sent) sent = [];
    if (sent.includes(member.user.id)) return;
    sent.push(member.user.id);
    await pool.query(`UPDATE stats SET policyannouncementsentto = $1;`, [[...new Set(sent)]]);
  }
};
