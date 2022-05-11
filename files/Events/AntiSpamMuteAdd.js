const Discord = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'AntiSpamMuteAdd',
	execute(msg, client, pool) {
		let warnnr;
		let muteRole = 0;
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
		function Continue(warnnr) {
			if (muteRole == 0) {
				pool.query(`SELECT * FROM muterole WHERE guildid = '${msg.guild.id}'`, (err, result) => {
					if (result == undefined) {
						muteRole = null;
						Continue2(muteRole, warnnr);
						return;
					} else if (result.rows[0] == undefined) {
						muteRole = null;
						Continue2(muteRole, warnnr);
						return;
					} else {
						muteRole = msg.guild.roles.cache.get(result.rows[0].muteroleid);
						Continue2(muteRole, warnnr);
					}
				});
			} else {
				Continue2(muteRole, warnnr);
			} 
			async function Continue2(muteRole, warnnr) {
				msg.channel.messages.fetch({
					limit: 100,
				}).then((msgs) => {
					const filterBy = msg.author.id;
					msgs = msgs.filter(m => m.author.id === filterBy).array().slice(0, 13);
					msg.channel.bulkDelete(msgs).catch(() => {
						msg.channel.send('Something went wrong, I wasnt able to delete any messages.').catch(() => {});
					}).catch(() => {});
				});
				if (muteRole == null) {
					muteRole = msg.guild.roles.cache.find(role => role.name === 'Muted');
				}
				if (!muteRole || muteRole == null || muteRole == 0) {
					let logchannelid = '';
					const reslog = await pool.query(`SELECT * FROM logchannel WHERE guildid = '${msg.guild.id}'`);
					if (reslog && reslog.rowCount > 0) logchannelid = reslog.rows[0].modlogs;
					const logchannel = client.channels.cache.get(logchannelid);
					if (logchannel) logchannel.send(`Couldnt Mute ${msg.author} due to a lack of MuteRoles\n**How to fix:** Either create a role named "Muted" or use the \`h!muterole\` command.`);
				} else {
					const user = msg.author;
					const muteReason = 'Spam';
					let mutedDMEmbed = new Discord.MessageEmbed()
						.setTitle(`You have been muted on the server __${msg.guild.name}__`)
						.setColor('#ff0000')
						.setDescription(`Reason: \`\`\`${muteReason}\`\`\``)
						.setTimestamp();
					const muteLog = new Discord.MessageEmbed()
						.setTitle(user.username + ' was muted in the server '+ msg.guild.name)
						.setColor('ff0000')
						.setThumbnail(user.displayAvatarURL())
						.setDescription(`${user} was tempmuted by ${client.user}`)
						.addField('Reason:', muteReason)
						.setTimestamp()
						.setFooter('Muted user ID: ' +user.id+ ' \nExecutor user ID: '+client.user.id);
					let logchannelid = '';
					const reslog = await pool.query(`SELECT * FROM logchannel WHERE guildid = '${msg.guild.id}'`);
					if (reslog && reslog.rowCount > 0) logchannelid = reslog.rows[0].modlogs;
					const logchannel = client.channels.cache.get(logchannelid);
					if (logchannel)logchannel.send(muteLog).catch(() => {});
					user.send(mutedDMEmbed).catch(() => {});
					const MuteEmbed = new Discord.MessageEmbed()
						.setDescription(`${user} has been muted\nWarn Number ${warnnr}`) 
						.setColor('ff0000')
						.setTimestamp();
					if (msg.guild.member(user)) {
						msg.guild.member(user).roles.add(muteRole).catch(() => {if (logchannel) logchannel.send(`I wasnt able to mute ${msg.author} due to improper permissions.\n Please be sure my role is above the Mute role and either grant me Administrator perms (to avoid future permission fails) or \`Manage_Roles\``);});
					}
					let length = ms('30m');
					const res = await pool.query(`SELECT * FROM antispamsettings WHERE guildid = '${msg.guild.id}'`);
					if (res) {
						if (res.rows[0]) {
							const calced = +res.rows[0].muteafterwarnsamount - +warnnr;
							if (calced == 1) {
								length == ms('30m');
							} else if (calced == 2) {
								length == ms('60m');
							} else if (calced == 3) {
								length == ms('120m');
							} else {
								length == ms('240m');
							}
						}
					}
					
					msg.channel.send(MuteEmbed).catch(() => {});
					const warnrnredo = await pool.query(`SELECT * FROM warns WHERE userid = '${user.id}' AND guildid = '${msg.guild.id}'`);
					if (warnrnredo !== undefined) {
						if (warnrnredo.rows[0] !== undefined) {
							for (let i = 0; i < warnrnredo.rowCount; i++) {
								let l = i;
								l++;
								await pool.query(`UPDATE warns SET warnnr = '${l}' WHERE guildid = '${msg.guild.id}' AND userid = '${user.id}' AND dateofwarn = '${warnrnredo.rows[i].dateofwarn}'`);
							}
						}
					}
					pool.query(`INSERT INTO warns (guildid, userid, reason, type, duration, closed, warnnr, dateofwarn, warnedinchannelid, warnedbyuserid, warnedinchannelname, warnedbyusername) VALUES ('${msg.guild.id}', '${user.id}', '${muteReason.replace(/'/g, '')}', 'Mute', '${+Date.now() + +length}', 'false', '${warnnr}', '${Date.now()}', '${msg.channel.id}', '${client.user.id}', '${msg.channel.name.replace(/'/g, '').replace(/`/, '')}', '${client.user.username.replace(/'/g, '').replace(/`/g, '')}')`);	
				}
			} 
		}
	}};
