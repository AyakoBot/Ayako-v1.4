const Discord = require('discord.js');
const { pool } = require('../files/Database.js');
module.exports = {
	name: 'test',
	Category: 'Info',
	description: 'Test the functionality of Ayako',
	usage: 'h!test',
	DMallowed: 'No',
	/* eslint-disable */
	execute(msg, args, client, prefix, command, logchannelid, permLevel, errorchannelID ) {
		/* eslint-enable */
		if (msg.guild.member(client.user).permissions.has('BAN_MEMBERS')) {
			var Banperms = '<:Tick:902269933860290650> I can Ban members';
		} else if (!msg.guild.member(client.user).permissions.has('BAN_MEMBERS')) {
			Banperms = '<:Cross:902269073805701211> I can\'t Ban members';
		}
		if (msg.guild.member(client.user).permissions.has('BAN_MEMBERS')) {
			var Unbanperms = '<:Tick:902269933860290650> I can Unban members';
		} else if (!msg.guild.member(client.user).permissions.has('BAN_MEMBERS')) {
			Unbanperms = '<:Cross:902269073805701211> I can\'t Unban members';
		}
		if (msg.guild.member(client.user).permissions.has('KICK_MEMBERS')) {
			var Kickperms = '<:Tick:902269933860290650> I can Kick members';
		} else if (!msg.guild.member(client.user).permissions.has('KICK_MEMBERS')) {
			Kickperms = '<:Cross:902269073805701211> I can\'t Kick members';
		}
		let Interactionsmode;
		pool.query(`SELECT mode FROM interactionsmode WHERE guildid = '${msg.guild.id}';`, (err, result) => {
			const restext = `${result.rows[0]}`;
			if (restext == 'undefined' || result.rows[0].mode == true) {
				Interactionsmode = '<:Small2:756379369739386910><:Small1:756379345190387712> Small';
				msglog(Interactionsmode);
			} else if (result.rows[0].mode == false) {
				Interactionsmode = '<:Big:756380855395549256> Big';
				msglog(Interactionsmode);
			}
		});
		function msglog(Interactionsmode) {
			if (msg.guild.member(client.user).permissions.has('MANAGE_ROLES')) {
				var Muteperms = '<:Tick:902269933860290650> I can Mute members';
			} else if (!msg.guild.member(client.user).permissions.has('MANAGE_ROLES')) {
				Muteperms = '<:Cross:902269073805701211> I can\'t Mute members';
			}
			if (msg.guild.member(client.user).permissions.has('MANAGE_ROLES')) {
				var Unmuteperms = '<:Tick:902269933860290650> I can Unmute members';
			} else if (!msg.guild.member(client.user).permissions.has('MANAGE_ROLES')) {
				Unmuteperms = '<:Cross:902269073805701211> I can\'t Unmute members';
			}
			if (msg.guild.member(client.user).permissions.has('MANAGE_ROLES')) {
				var Tempmuteperms = '<:Tick:902269933860290650> I can Tempmute members';
			} else if (!msg.guild.member(client.user).permissions.has('MANAGE_ROLES')) {
				Tempmuteperms = '<:Cross:902269073805701211> I can\'t Tempmute members';
			}

			pool.query(`SELECT muteroleid FROM muterole WHERE guildid = '${msg.guild.id}';`, (err, result) => {
				let MuteRole;
				const restext = `${result.rows[0]}`;
				if (restext == 'undefined') {
					MuteRole = msg.guild.roles.cache.find(role => role.name === 'Muted');
					if (!MuteRole) {
						MuteRole = '<:Cross:902269073805701211> Not set';
						MuteRoleF(MuteRole);
					} else {
						MuteRoleF(MuteRole);
					}
				} else {
					MuteRole = `<:Tick:902269933860290650> ${msg.guild.roles.cache.find(role => role.id === result.rows[0].muteroleid)}`;
					MuteRoleF(MuteRole);
				}
			});
			function MuteRoleF(MuteRole) {


				let Prefix;
				pool.query(`SELECT * FROM prefix WHERE guildid = '${msg.guild.id}';`, (err, result) => {
					const restext = `${result.rows[0]}`;
					if (restext == 'undefined') {
						Prefix = '<:Cross:902269073805701211> Not set';
						PrefixF(msg, Prefix);
					} else {
						Prefix = `<:Tick:902269933860290650> \`${result.rows[0].prefix}\``;
						PrefixF(msg, Prefix);
					}
				});
				async function PrefixF(msg, Prefix) {	
					const res = await pool.query('SELECT * FROM warns;');
					let Warnsamount;
					if (res !== undefined) {  
						Warnsamount = res.rowCount;
					}
					
					const result = await pool.query('SELECT * FROM pg_catalog.pg_tables;');
					let totalamount = 0;
					for (let i = 0; i < result.rowCount; i++) {
						try {
							const res = await pool.query(`SELECT * FROM ${result.rows[i].tablename};`);
							totalamount = +totalamount + res.rowCount;
						} catch(error) {
							totalamount = +totalamount + 0;
						}
					}
					const Testembed = new Discord.MessageEmbed()
						.setTitle('Test results')
						.setColor('b0ff00')
						.addFields(
							{ name: '**Permissions**', value: '\u200B', inline: false },
							{ name: '|Ban', value: Banperms, inline: true },
							{ name: '|Kick', value: Kickperms, inline: true },
							{ name: '|Mute', value: Muteperms, inline: true },
							{ name: '|Tempmute', value: Tempmuteperms, inline: true },
							{ name: '|Unban', value: Unbanperms, inline: true },
							{ name: '|Unmute', value: Unmuteperms, inline: true },
							{ name: '\u200B', value: '\u200B', inline: false },
							{ name: '**Server Settings**', value: '\u200B', inline: false },
							{ name: '|Muterole', value: MuteRole, inline: true },
							{ name: '|Custom Prefix', value: Prefix, inline: true },
							{ name: '|Interactionmode', value: Interactionsmode, inline: true },
							{ name: '\u200B', value: '\u200B', inline: false },
							{ name: '**Stats**', value: '\u200B', inline: false },
							{ name: '|Warns', value: `${Warnsamount} warns have been given`, inline: true },
							{ name: '|All DataBase entries', value: `${totalamount}`, inline: true }
						)
						.setTimestamp();
					msg.channel.send(Testembed);
		

				}}}}}; 