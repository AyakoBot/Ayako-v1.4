const Discord = require('discord.js');

module.exports = {
	name: 'AntiSpamOfWarnAdd',
	execute(msg, client, pool) {
		console.log('AntiSpamOfWarnAdd');
		let warnnr;
		pool.query(`SELECT * FROM warns WHERE guildid = '${msg.guild.id}' AND userid = '${msg.author.id}'`, (err, result) => {
			if (result == undefined) {
				warnnr = 1;
				Continue(warnnr);
				return;
			}
			if (result.rows[0] == undefined) {
				warnnr = 1;
				Continue(warnnr);
				return;
			} else {
				warnnr = result.rowCount;
				warnnr++;
				Continue(warnnr);
			}
	
		});
		async function Continue(warnnr) {
			const warnrnredo = await pool.query(`SELECT * FROM warns WHERE userid = '${msg.author.id}' AND guildid = '${msg.guild.id}'`);
			if (warnrnredo !== undefined) {
				if (warnrnredo.rows[0] !== undefined) {
					for (let i = 0; i < warnrnredo.rowCount; i++) {
						let l = i;
						l++;
						await pool.query(`UPDATE warns SET warnnr = '${l}' WHERE guildid = '${msg.guild.id}' AND userid = '${msg.author.id}' AND dateofwarn = ${warnrnredo.rows[i].dateofwarn}`);
					}
				}
			}
			pool.query(`INSERT INTO warns (guildid, userid, reason, type, warnnr, dateofwarn, warnedinchannelid, warnedbyuserid, warnedinchannelname, warnedbyusername) VALUES ('${msg.guild.id}', '${msg.author.id}', 'Spam', 'Warn', '${warnnr}', '${Date.now()}', '${msg.channel.id}', '${client.user.id}', '${msg.channel.name.replace(/'/g, '')}', '${client.user.username.replace(/'/g, '')}')`);
			const warnEmbed = new Discord.MessageEmbed()
				.setTitle(`You have been warned on the server __${msg.guild.name}__`)
				.setColor('#ff0000')
				.setDescription('```Spam```')
				.setTimestamp();
			msg.author.send(warnEmbed).catch(() => {});
			const ReplyEmbed = new Discord.MessageEmbed()
				.setDescription(`${msg.author} was warned\nWarn Number ${warnnr}.`)
				.setColor('#ff0000')
				.setTimestamp();
			msg.channel.send(ReplyEmbed).catch(() => {});
			let logchannelid = '';
			const res = await pool.query(`SELECT * FROM logchannel WHERE guildid = '${msg.guild.id}'`);
			if (res && res.rowCount > 0) logchannelid = res.rows[0].modlogs;
			const logchannel = client.channels.cache.get(logchannelid);
			const WarnLogEmbed = new Discord.MessageEmbed()
				.setTitle(`${msg.author.username} has been warned on the server ${msg.guild.name}`)
				.setThumbnail(msg.author.displayAvatarURL())
				.setDescription(`${msg.author} was warned by ${client.user}`)
				.addField('Reason:', 'Spam')
				.setColor('#ff0000')
				.setFooter(`Warned user ID: ${msg.author.id}\nExecutor user ID: ${client.user.id}`)
				.setTimestamp();
			if (logchannel)logchannel.send(WarnLogEmbed).catch(() => {});
		}
	}
};
