const Discord = require('discord.js');
const cooldown = new Set();
const cooldownServer = new Set();

module.exports = {
	name: 'Levelingmsg',
	async execute(msg, pool, client) {
		if (msg.author.bot) return;
		if (msg.channel.type == 'dm') return;
		const resG = await pool.query(`SELECT * FROM levelglobal WHERE userid = '${msg.author.id}';`);
		if (resG !== undefined) {
			if (resG.rows[0] !== undefined) {
				const resSpam = await pool.query(`SELECT * FROM antilevelspam WHERE userid = '${msg.author.id}';`);
				if (resSpam) {
					if (resSpam.rows[0]) {
						if (msg.content.replace('\'', '').replace('`', '') == resSpam.rows[0].message) {
							return;
						}
					}
				}
				const user = client.users.cache.get(resG.rows[0].userid);
				const curXP = resG.rows[0].xp;
				const curLvL = resG.rows[0].level;
				let votegain;
				if (resG.rows[0].votegain == null) {
					votegain = 1;
				} else {
					votegain = resG.rows[0].votegain;
				}
				if (user && user.id) {
					if (!cooldown.has(msg.author.id)) {
						cooldown.add(msg.author.id);
						if (resSpam) {
							if (resSpam.rows[0]) {
								pool.query(`UPDATE antilevelspam SET message = '${msg.content.replace(/'/g, '').replace('`', '')}' WHERE userid = '${msg.author.id}';`);
							} else {
								pool.query(`INSERT INTO antilevelspam (userid, message) VALUES ('${msg.author.id}', '${msg.content.replace(/'/g, '').replace('`', '')}');`);
							}
						} else {
							pool.query(`INSERT INTO antilevelspam (userid, message) VALUES ('${msg.author.id}', '${msg.content.replace(/'/g, '').replace('`', '')}');`);
						}
						setTimeout(() => {
							cooldown.delete(msg.author.id);
						}, 60000);
						const newXP = Math.floor(Math.random() * 10 + 10) * +votegain;
						const XP = +curXP + +newXP;
						await pool.query(`UPDATE levelglobal SET xp = '${XP}' WHERE userid = '${user.id}';`);
						const newLevel = +curLvL + 1;
						const neededXP = 5 / 6 * +newLevel * (2 * +newLevel * +newLevel + 27 * +newLevel + 91);
						if (+XP > +neededXP) {
							await pool.query(`UPDATE levelglobal SET level = '${newLevel}' WHERE userid = '${user.id}';`);
						}
					}
				}
			} else {
				pool.query(`INSERT INTO levelglobal(userid, xp, level) VALUES ('${msg.author.id}', '1', '0');`).catch(() => { });
			}
		}
		const resS = await pool.query(`SELECT * FROM levelsettings WHERE guildid = '${msg.guild.id}';`);
		let settings;
		if (resS !== undefined && resS.rows[0] !== undefined) {
			settings = resS.rows[0];
		} else {
			settings = [];
			settings.disabled = false;
			settings.xpgain = 1;
			settings.blchannelid = [];
			settings.lvlupmode = 'silent';
		}
		if (settings.disabled == true) return;
		if (settings.disabled == false) {
			if (settings.blchannelid) {
				if (settings.blchannelid.includes(msg.channel.id)) {
					return;
				}
			}
			if (!cooldownServer.has(msg.author.id)) {
				cooldownServer.add(msg.author.id);
				setTimeout(() => {
					cooldownServer.delete(msg.author.id);
				}, 60000);
				const result = await pool.query(`SELECT * FROM levelserver WHERE userid = '${msg.author.id}' AND guildid = '${msg.guild.id}';`);
				if (result !== undefined && result.rows[0] !== undefined) {
					const curXP = result.rows[0].xp;
					const curLvL = result.rows[0].level;
					const newXP = Math.floor(Math.random() * 10 + 15) * +settings.xpgain;
					const XP = +curXP + +newXP;
					await pool.query(`UPDATE levelserver SET xp = '${XP}' WHERE userid = '${msg.author.id}' AND guildid = '${msg.guild.id}';`);
					const newLevel = +curLvL + 1;
					const neededXP = 5 / 6 * +newLevel * (2 * +newLevel * +newLevel + 27 * +newLevel + 91);
					if (+XP > +neededXP) {
						await pool.query(`UPDATE levelserver SET level = '${newLevel}' WHERE userid = '${msg.author.id}' AND guildid = '${msg.guild.id}';`);
						if (newLevel == 1) {
							if (settings.lvlupmode == 'reactions') {
								const LevelUpEmbed = new Discord.MessageEmbed()
									.setAuthor(`${msg.author.tag} just advanced to level ${newLevel}`, msg.author.displayAvatarURL())
									.setTimestamp()
									.setDescription('Level Ups are indicated by me reacting to your message with <:AMayakopeek:924071140257841162>🆙')
									.setColor('b0ff00')
									.setFooter('You will only be notified every 10 levels.');
								msg.channel.send(LevelUpEmbed).then(send => { setTimeout(function () { send.delete().catch(() => { }); }, 10000); }).catch(() => { });
								msg.react('762021849558810644').catch(() => { });
								msg.react('🆙').catch(() => { });
								setTimeout(function () { msg.reactions.removeAll().catch(() => { }); }, 10000);
							}
						}
						if (newLevel % 10 == 0) {
							if (settings.lvlupmode == 'reactions') {
								const LevelUpEmbed = new Discord.MessageEmbed()
									.setAuthor(`${msg.author.tag} just advanced to level ${newLevel}`, msg.author.displayAvatarURL())
									.setTimestamp()
									.setColor('b0ff00')
									.setFooter('You will only be notified every 10 levels.');
								msg.channel.send(LevelUpEmbed).then(send => { setTimeout(function () { send.delete().catch(() => { }); }, 10000); }).catch(() => { });
							}
						} else {
							let leveluptext = `${msg.author.tag} advanced to level ${newLevel}`;
							const res = await pool.query(`SELECT * FROM levelsettings WHERE guildid = '${msg.guild.id}';`)
							if (res && res.rowCount > 0 && res.rows[0].text) {
								leveluptext = res.rows[0].text.replace('{user}', `${msg.author.tag}`).replace('{level}', `${newLevel}`).replace('/u2b', '\'');
							}
							if (settings.lvlupmode == 'reactions') {
								msg.react('762021849558810644').catch(() => { });
								msg.react('🆙').catch(() => { });
								setTimeout(function () { msg.reactions.removeAll().catch(() => { }); }, 10000);
							} else if (settings.lvlupmode == 'messages') {
								const embed = new Discord.MessageEmbed()
									.setDescription(`${leveluptext}`, msg.author.displayAvatarURL())
									.setColor('b0ff00');
								let channel;
								if (settings.lvlupchannel) {
									channel = client.channels.cache.get(settings.lvlupchannel);
									if (!channel) {
										channel = msg.channel;
									}
								} else {
									channel = msg.channel;
								}
								channel.send(`${msg.author}`, embed).catch(() => { });
							}
						}
						const resR = await pool.query(`SELECT * FROM levelroles WHERE guildid = '${msg.guild.id}' AND level < '${+newLevel + 1}';`);
						if (resR !== undefined && resR.rows[0] !== undefined) {
							for (let i = 0; i < resR.rowCount; i++) {
								const role = msg.guild.roles.cache.find(role => role.id === resR.rows[i].roleid);
								if (!msg.guild.member(msg.author).roles.cache.has(role.id)) {
									msg.guild.member(msg.author).roles.add(role).catch(() => { });
								}
							}
						}
					}
				} else {
					const newXP = Math.floor(Math.random() * 10 + 15);
					await pool.query(`INSERT INTO levelserver(guildid, userid, xp, level) VALUES ('${msg.guild.id}', '${msg.author.id}', '${newXP}', '0');`);
				}
			}
		}
	}
};