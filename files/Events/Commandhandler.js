const prefix1 = 'h!';
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();

module.exports = {
	name: 'Commandhandler',
	async execute(msg, pool, client, statcord) {
		if (msg.author.id !== '650691698409734151') {
			if (msg.author.bot) return;}
		let prefix2;
		if (msg.channel.type !== 'dm') {
			pool.query(`SELECT prefix FROM prefix WHERE guildid = '${msg.guild.id}';`, (err, result) => {
				if (result !== undefined) {
					if (result.rows[0] == undefined) {
						prefix2 = prefix1;
						prefixF(prefix2);
						return;
					} else {
						prefix2 = result.rows[0].prefix;
						prefixF(prefix2);
						return;
					}
				} else {
					prefix2 = prefix1;
					prefixF(prefix2);
					return;
				}
			});
		} else {
			prefix2 = prefix1;
			prefixF(prefix2);
			return;
		}
		function prefixF(prefix2) {
			if(msg.content.toLowerCase().startsWith(prefix1) || msg.content.toLowerCase().startsWith(prefix2)) {
				let prefix;
				if(msg.content.toLowerCase().startsWith(prefix1)) {
					prefix = prefix1;
				}
				else {
					prefix = prefix2;
				}	
				handler2Function(msg, prefix);}

			async function handler2Function(msg, prefix) {
				if (!prefix) return;
				const args = msg.content.slice(prefix.length).split(/ +/);
				const commandName = args.shift().toLowerCase();
				const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
				if (commandName == 'interactions') return;
				if (!command) return;
				if (msg.channel.type == 'dm') {
					commandhandler2function(msg, args, client, prefix, command, commandName, cooldowns); 
					return;
				}
				if (msg.author.id == '318453143476371456' || msg.author.id == '650691698409734151') {
					cooldowns.set(command.name, new Discord.Collection());
					commandhandler2function(msg, args, client, prefix, command, commandName, cooldowns);
					return;
				}
				if (!cooldowns.has(command.name)) {
					cooldowns.set(command.name, new Discord.Collection());
				}
				const requiredPerms = command.requiredPermissions;
				let permLevel;

				if (msg.guild.member(msg.author).permissions.has('ADMINISTRATOR')) permLevel = 1;
				else if  (msg.guild.member(msg.author).permissions.has('MANAGE_GUILD')) permLevel = 2;
				else if  (msg.guild.member(msg.author).permissions.has('MANAGE_ROLES') || msg.guild.member(msg.author).permissions.has('MANAGE_CHANNELS') || msg.guild.member(msg.author).permissions.has('BAN_MEMBERS')) permLevel = 3;
				else if  (msg.guild.member(msg.author).permissions.has('KICK_MEMBERS') || msg.guild.member(msg.author).permissions.has('MANAGE_MESSAGES')) permLevel = 4;
				else if  (msg.guild.member(msg.author).permissions.has('MANAGE_NICKNAMES')) permLevel = 5;    
				else permLevel = 6;
				if (msg.author.id == '318453143476371456') permLevel = 0;
				console.log(permLevel, requiredPerms);
				const res = await pool.query(`SELECT * FROM modroles WHERE guildid = '${msg.guild.id}'`);
				if (res && res.rowCount > 0) {
					const r = res.rows[0];
					if (r.adminrole) { 
						const role = msg.guild.roles.cache.find(role => role.id === r.adminrole);
						if (role && role.id) {
							if (msg.guild.member(msg.author).roles.cache.has(role.id)) {
								if (commandName == 'ban' || commandName == 'unban' || commandName == 'mute' || commandName == 'unmute' || commandName == 'tempmute' || commandName == 'kick' || commandName == 'clear' || commandName == 'announce' || commandName == 'pardon' || commandName == 'warn' || commandName == 'edit' || commandName == 'takerole' || commandName == 'giverole' ) {									
									const res2 = await pool.query(`SELECT * FROM modperms WHERE guildid = '${msg.guild.id}' AND type = 'admin' AND permission = '${commandName}'`);
									if (res2 && res2.rowCount > 0) {
										const r2 = res2.rows[0];
										if (r2.granted) {
											commandhandler2function(msg, args, client, prefix, command, commandName, cooldowns, permLevel);
											return;
										} else {
											msg.reply('You don\'t have enough permissions to execute this command. Perm Error: 1').catch(() => {});
											return;
										}
									} else {
										msg.reply('You don\'t have enough permissions to execute this command. Perm Error: 3').catch(() => { });
										return;
									}
								}
							}
						} else {
							msg.reply('Something is wrong with your Admin Role! Please visit `h!adminrole` to fix');
						}
					}
					if (r.modrole) { 
						const role = msg.guild.roles.cache.find(role => role.id === r.modrole);
						if (role && role.id) {
							if (msg.guild.member(msg.author).roles.cache.has(role.id)) {
								if (commandName == 'ban' || commandName == 'unban' || commandName == 'mute' || commandName == 'unmute' || commandName == 'tempmute' || commandName == 'kick' || commandName == 'clear' || commandName == 'announce' || commandName == 'pardon' || commandName == 'warn' || commandName == 'edit' || commandName == 'takerole' || commandName == 'giverole' ) {
									const res2 = await pool.query(`SELECT * FROM modperms WHERE guildid = '${msg.guild.id}' AND type = 'mod' AND permission = '${commandName}'`);
									if (res2 && res2.rowCount > 0) {
										const r2 = res2.rows[0];
										if (r2.granted) {
											commandhandler2function(msg, args, client, prefix, command, commandName, cooldowns, permLevel);
											return;
										} else {
											msg.reply('You don\'t have enough permissions to execute this command. Perm Error: 2').catch(() => {});
											return;
										}
									} else {
										msg.reply('You don\'t have enough permissions to execute this command. Perm Error: 3').catch(() => { });
										return;
									}
								}
							}
						} else {
							msg.reply('Something is wrong with your Mod Role! Please visit `h!modrole` to fix');
						}
					}
					if (r.trialmodrole) { 
						const role = msg.guild.roles.cache.find(role => role.id === r.trialmodrole);
						if (role && role.id) {
							if (msg.guild.member(msg.author).roles.cache.has(role.id)) {
								if (commandName == 'ban' || commandName == 'unban' || commandName == 'mute' || commandName == 'unmute' || commandName == 'tempmute' || commandName == 'kick' || commandName == 'clear' || commandName == 'announce' || commandName == 'pardon' || commandName == 'warn' || commandName == 'edit' || commandName == 'takerole' || commandName == 'giverole' ) {									
									const res2 = await pool.query(`SELECT * FROM modperms WHERE guildid = '${msg.guild.id}' AND type = 'trial' AND permission = '${commandName}'`);
									if (res2 && res2.rowCount > 0) {
										const r2 = res2.rows[0];
										if (r2.granted) {
											commandhandler2function(msg, args, client, prefix, command, commandName, cooldowns, permLevel);
											return;
										} else {
											msg.reply('You don\'t have enough permissions to execute this command. Perm Error: 3').catch(() => {});
											return;
										}
									} else {
										msg.reply('You don\'t have enough permissions to execute this command. Perm Error: 4').catch(() => { });
										return;
									}
								}
							}
						} else {
							msg.reply('Something is wrong with your Trial Mod Role! Please visit `h!trialmodrole` to fix');
						}
					}
				}
				if(permLevel > requiredPerms) {
					msg.reply('You don\'t have enough permissions to execute this command. Perm Error: 5').catch(() => {});
					return;
				}
				
				commandhandler2function(msg, args, client, prefix, command, commandName, cooldowns, permLevel);


				async function commandhandler2function(msg, args, client, prefix, command, commandName, cooldowns, permLevel) {
					const DMallowed = command.DMallowed;
					if (msg.channel.type == 'dm') {
						if (msg.channel.type == 'dm' && DMallowed !== 'Yes') {
							msg.channel.send('This command is not made for DMs. Please try again in a Server.').catch(() => {});
							return;
						}
						commandhandler2lastfunction(msg, args, client, prefix, command, commandName, cooldowns, permLevel);
						return;
					}
					const now = Date.now();
					let timestamps = cooldowns.get(command.name);
					var cooldownAmount = (command.cooldown || 1);
					let res = await pool.query(`SELECT * FROM cooldowns WHERE guildid = '${msg.guild.id}' AND command = '${command.name}'`);
					if (!res || res.rowCount == 0) res = await pool.query(`SELECT * FROM cooldowns WHERE channelid = '${msg.channel.id}' AND command = '${command.name}'`);
					if (res && res.rowCount > 0) {
						const r = res.rows[0];
						cooldownAmount = (r.cooldown);
					}
					if (timestamps.has(msg.channel.id)) {
						const expirationTime = +timestamps.get(msg.channel.id) + +cooldownAmount;
						if (now < expirationTime) {
							const timeLeft = (expirationTime - now) / 1000;
							setTimeout(() => {
								msg.delete().catch(() => {});
							}, 1);
							return msg.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before re-using the \`${command.name}\` command.`).then(send => { setTimeout(function(){  send.delete().catch(() => {});  }, 10000);  }).catch(() => {});
						}
					}
					timestamps.set(msg.channel.id, now);
					let Category = command.Category;
					if (Category) {
						Category = Category.toLocaleLowerCase();
						const res = await pool.query(`SELECT * FROM disabled WHERE guildid = '${msg.guild.id}'`);
						if (res) {
							if (res.rows[0]) {
								const Categories = ['moderation', 'moderation (advanced)', 'fun', 'selfroles', 'miscellaneous', 'info', 'suggestion', 'antispam', 'welcome', 'giveaway', 'nitro', 'leveling', 'blacklist'];
								let disabled = false;
								if (Category == Categories[0]) {if (res.rows[0].moderation == false) disabled = true;}
								if (Category == Categories[1]) {if (res.rows[0].moderationAdvanced == false) disabled = true;}
								if (Category == Categories[2]) {if (res.rows[0].fun == false) disabled = true;}
								if (Category == Categories[3]) {if (res.rows[0].selfroles == false) disabled = true;}
								if (Category == Categories[4]) {if (res.rows[0].miscellaneous == false) disabled = true;}
								if (Category == Categories[5]) {if (res.rows[0].info == false) disabled = true;}
								if (Category == Categories[6]) {if (res.rows[0].suggestion == false) disabled = true;}
								if (Category == Categories[7]) {if (res.rows[0].antispam == false) disabled = true;}
								if (Category == Categories[8]) {if (res.rows[0].welcome == false) disabled = true;}
								if (Category == Categories[9]) {if (res.rows[0].giveaway == false) disabled = true;}
								if (Category == Categories[10]) {if (res.rows[0].nitro == false) disabled = true;}
								if (Category == Categories[11]) {if (res.rows[0].leveling == false) disabled = true;}
								if (Category == Categories[12]) {if (res.rows[0].blacklist == false) disabled = true;}
								if (disabled == true) {
									msg.reply(`Category ${Category} was disabled. Ask a Server Administrator to re-enable it.`);
									return;
								}
							}
						}
					}
					const GuildSpezCmd = command.ThisGuildOnly;
					if (GuildSpezCmd) {
						if (!GuildSpezCmd.includes(msg.guild.id)) {
							return;
						}
					}
					if (msg._edits.length > 0) {
						if (command.Category == 'Moderation') {
							verifier(msg, args, client, prefix, command, commandName, cooldowns, permLevel);
						} else {
							commandhandler2lastfunction(msg, args, client, prefix, command, commandName, cooldowns, permLevel);
						}
					} else {
						commandhandler2lastfunction(msg, args, client, prefix, command, commandName, cooldowns, permLevel);
					}

					async function verifier(msg, args, client, prefix, command, commandName, cooldowns, permLevel) {
						const m = await msg.reply('You just issued a **moderation command** by **editing your message**. \nDo you want to **proceed or abort**.').catch(() => {});
						m.react('902269933860290650').catch(() => {});
						m.react('902269073805701211').catch(() => {});
						msg.channel.awaitMessages(m => m.author.id == msg.author.id,
							{max: 1, time: 30000}).then(rawcollected => {
							if (!rawcollected.first()) return;
							if (rawcollected.first().content.toLowerCase() == 'y' || rawcollected.first().content.toLowerCase() == 'yes' || rawcollected.first().content.toLowerCase() == 'proceed' || rawcollected.first().content.toLowerCase() == 'continue' || rawcollected.first().content.toLowerCase() == 'go') {
								if (m.deleted == false) {
									rawcollected.first().delete().catch(() => {});
									m.delete().catch(() => {});
									commandhandler2lastfunction(msg, args, client, prefix, command, commandName, cooldowns, permLevel);
								}
							} else {
								m.delete().catch(() => {});
								return;
							}
						}).catch(() => {m.delete().catch(() => {});});

						m.awaitReactions((reaction, user) => (reaction.emoji.id === '902269933860290650' || reaction.emoji.id === '902269073805701211') && user.id === msg.author.id,
							{max: 1, time: 60000}).then(rawcollected => {
							if (!rawcollected.first()) return;
							if (rawcollected.first()._emoji.id == '902269933860290650') {
								m.delete().catch(() => {});
								commandhandler2lastfunction(msg, args, client, prefix, command, commandName, cooldowns, permLevel);
							} else {
								m.delete().catch(() => {});
								return;
							}
						}).catch(() => {m.delete().catch(() => {});});
					}

					async function commandhandler2lastfunction(msg, args, client, prefix, command, commandName, cooldowns, permLevel) {
						let logchannelid = '';
						if (msg.channel.type !== 'dm' && command.name !== 'interactions') {
							const res = await pool.query(`SELECT * FROM logchannel WHERE guildid = '${msg.guild.id}'`);
							if (res && res.rowCount > 0) logchannelid = res.rows[0].modlogs;
							console.log(`|Command executed: ${command.name}	| Executed by ${msg.author.id}	| Executed at ${new Date(Date.now()).toLocaleString()}\nIn Guild: ${msg.guild.id} / ${msg.guild.name} | Channel: ${msg.channel.id} / ${msg.channel.name}\n`);
						} else if (command.name !== 'interactions'){
							console.log(`|Command executed: ${command.name}	| Executed by ${msg.author.id}	| Executed at ${new Date(Date.now()).toLocaleString()}\nIn DMs: ${msg.author.id} / ${msg.author.username}\n`);
						}
        
						try {
							if (msg.author.id == '650691698409734151') {
								setTimeout(() => {
									msg.delete().catch(() => {});
								}, 1);
							}
							const errorchannelID = '731421877276508170';
							statcord.postCommand(command.name, msg.author.id).catch(() => {});
							if (msg.channel.type !== 'dm') {
								const res = await pool.query(`SELECT * FROM logchannel WHERE guildid = '${msg.guild.id}'`);
								if (res && res.rowCount > 0) logchannelid = res.rows[0].modlogs;
							}
							command.execute(msg, args, client, prefix, command, logchannelid, permLevel, errorchannelID);
						} catch(error) {
							const errorchannel = client.channels.cache.get('731421877276508170');
							const errorEmbed = new Discord.MessageEmbed()
								.setColor('RED')
								.setDescription(`${msg}\n\`\`\`${error.stack}\`\`\``)
								.setTimestamp();
							errorchannel.send(errorEmbed).catch(() => {});
						}	
					}
				}
			}
		}   
	}
};
