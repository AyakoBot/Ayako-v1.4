const ms = require('ms');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
  name: 'Afkmsg',
  async execute(msg, pool) {
    if (msg.author) {
      if (msg.author.bot) return;
      if (msg.guild) {
        const res = await pool.query(
          `SELECT * FROM afk WHERE userid = '${msg.author.id}' AND guildid = '${msg.guild.id}';`,
        );
        if (res) {
          if (res.rows[0]) {
            const duration = moment
              .duration(Math.abs(Date.now() - +res.rows[0].since))
              .format('Y [years], M [months], D [days], H [hrs], m [mins], s [secs]', {
                trim: 'all',
              });

            if (+res.rows[0].since + ms('1m') < Date.now()) {
              if (msg.author.id == '329328217838059521')
                msg
                  .reply(
                    'I have deleted thy AFK, my majesty\nOur saviour has returned, after ' +
                      duration,
                  )
                  .then((m) => {
                    m.delete({ timeout: 10000 }).catch(() => {});
                  })
                  .catch(() => {});
              else
                msg
                  .reply("I've deleted your AFK\nYou have been AFK for " + duration)
                  .then((m) => {
                    m.delete({ timeout: 10000 }).catch(() => {});
                  })
                  .catch(() => {});
              pool.query(
                `DELETE FROM afk WHERE userid = '${msg.author.id}' AND guildid = '${msg.guild.id}';`,
              );
            }
          }
        }
        const args = msg.content.split(/ +/);
        args.forEach(async (arg) => {
          if (arg.includes('<@')) {
            const res = await pool.query(
              `SELECT * FROM afk WHERE userid = '${arg.replace(/\D+/g, '')}' AND guildid = '${
                msg.guild.id
              }';`,
            );
            if (res) {
              if (res.rows[0]) {
                const duration = moment
                  .duration(Number(+res.rows[0].since - Date.now()))
                  .format('Y [years], M [months], D [days], H [hrs], m [mins], s [secs]', {
                    trim: 'all',
                  });

                msg
                  .reply(`${res.rows[0].text} ${duration.replace(/-/g, '')}`, {
                    disableMentions: 'everyone',
                  })
                  .catch(() => {});
              }
            }
          }
        });
      }
    }
  },
};
