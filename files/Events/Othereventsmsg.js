const Discord = require('discord.js');
const { pool } = require('../../files/Database.js');

module.exports = {
	name: 'Othereventsmsg',
	async execute(msg, client) {
		if (msg.channel.id == '888388136755937330') msg.react('👍'), msg.react('👎');
		if (msg.channel.id == '851779578846117888') return;
		if (msg.channel.id == '757879586439823440' && msg.author.id == '646937666251915264') {
			if (msg.content.includes('since this server is currently active')) msg.channel.send('<@&893986129773207582> Karuta has dropped Cards! Move or loose.');
			if (msg.content.includes('A card from your wishlist is dropping')) msg.channel.send('<@&893986129773207582> a wished Card was dropped! Move or loose.');
		} 
		if (msg.channel.id == '803246561995522059' && msg.attachments.size == 0 && !msg.member.roles.cache.has('278332463141355520') && !msg.member.roles.cache.has('293928278845030410')) msg.delete().catch(() => { }); 	
		if (msg.author.id == '868115102681956404' && msg.channel.id == '757879586439823440' && msg.content.includes('@Known-Scammers ping:')) {
			const words = msg.content.split(/ +/);
			words.forEach(word => {
				if (word.includes('\n')) words.splice(words.indexOf(word), 1), word.split(/\n+/).forEach(w => words.push(w));
			});
			const arr = [];
			words.forEach((word) => {
				const w = word.replace(/\D+/g, '');
				if (w.length > 15) arr.push(w);
			});
			const done = [];
			for (let i = 0; i < arr.length; i++) {
				const ID = arr[i];
				const ban = await msg.guild.members.ban(ID, { reason: 'Ayako Auto-Ban | Karuta Scammer' });
				if (ban) done.push(`Ban Success on User with ID: \`${ID}\``);
				else done.push(`Ban failed on User with ID \`${ID}\``);
			}
			const embed = new Discord.MessageEmbed()
				.setTitle('Karuta Scammer Auto-Ban')
				.setDescription(`Detected ${arr.length} User IDs` + done.map(a => `\n${a}`))
				.setColor('RED');
			msg.channel.send(embed);
		}
		if (msg.channel.type == 'dm') {
			if (msg.author.id == client.user.id) return;
			const dmembed = new Discord.MessageEmbed()
				.setColor('b0ff00')
				.setDescription(`${msg.author} / ${msg.author.id}\n\u200b${msg.content}`)
				.addField('\u200b', msg.url)
				.setTimestamp();
			for (let i = 0; i < msg.attachments.length; i++) {dmembed.addField('\u200b', msg.attachments[i].url);}
			for (let i = 0; i < msg.embeds.length; i++) {dmembed.addField('\u200b', msg.embeds[i].title ? msg.embeds[i].title : (msg.embeds[i].author.name && msg.embeds[i].author) ? msg.embeds[i].author.name : 'none');}
			client.channels.cache.get('825297763822469140').send(dmembed);
			return;
		}
		if (msg.channel.id == '854305348600201266') {
			if (!msg.member.roles.cache.has('293928278845030410') && msg.attachments.size == 0) msg.delete();
			else if (msg.attachments.size > 0) {
				msg.react('902269933860290650');
				msg.react('902269073805701211');
			} 
		}
		if (msg.guild.id == '108176345204264960' && (msg.content.toLocaleLowerCase().includes('https://') || msg.content.toLocaleLowerCase().includes('http://')) && !msg.member.roles.cache.has('293928278845030410') && !msg.member.roles.cache.has('278332463141355520') && !msg.author.bot) msg.delete().catch(() => {});
		if (msg.guild.id == '366219406776336385' && msg.channel.id !== '801804774759727134') {
			if (msg.content.toLocaleLowerCase().includes('discord.gg/')) {
				if (msg.author.id !== '267835618032222209' && msg.author.id !== '400086473337995265') {
					if (msg.guild.member(msg.author)) {
						if (!msg.guild.member(msg.author).permissions.has('MANAGE_GUILD')) {
							if (msg.channel.id !== '765732828892758026') {
								if (msg.author.bot) return;
								msg.delete().catch(() => {});
								msg.reply('**Do not send Discord Links in this Channel**').then((m) => { setTimeout(() => { m.delete().catch(() => { }); }, 10000); });
							}
						}
					} else {
						if (msg.author.bot) return;
						msg.delete().catch(() => { });
					}
				}
			}
			if (msg.content.toLowerCase().includes('https://') || msg.content.toLowerCase().includes('http://')) {
				if (msg.guild.member(msg.author) && msg.channel.id !== '851779578846117888') {
					if (msg.guild.member(msg.author).roles.cache.has('369619820867747844') || msg.guild.member(msg.author).roles.cache.has('367781331683508224') || msg.guild.member(msg.author).roles.cache.has('585576789376630827') || msg.channel.id == '367403201646952450' || msg.channel.id == '777660259200270376') return;
					if (msg.author.bot) return;
					msg.delete().then(msg.reply('You are not allowed to post links yet. `Needed role: Level 30 | VIP | Nobles`').then(send => { setTimeout(function () { send.delete().catch(() => { }); }, 10000); }).catch(() => { })).catch(() => { });
				} else {
					if (msg.author.bot) return;
					msg.delete().catch(() => { });
				}
			}
		}
		if (msg.channel.id == '791390835916537906') {
			if (msg.attachments.size < 1) {
				if (!msg.guild.member(msg.author).roles.cache.has('366238244775657472') && !msg.guild.member(msg.author).roles.cache.has('776248679363248168')) {
					if (msg.author.id !== client.user.id) {
						if (msg.author.bot) return;
						msg.delete().catch(() => { });
					}
				}
			}
		}
		if (msg.guild.id == '298954459172700181') {
			if (msg.content.toLowerCase().includes('nazi') || msg.content.toLowerCase().includes('jew') || Date.now() - msg.author.createdAt < 1000 * 60 * 20) {
				msg.react('❔').catch(() => { });
				msg.channel.awaitMessages(m => m.author.id == '318453143476371456',
					{ max: 1, time: 60000 }).then(collected => {
					const content = collected.first().content.toLowerCase();
					if (content == 'y') {
						msg.guild.members.ban(msg.author, {
							days: 1,
							reason: 'Executor: Lars_und_so#0666 | no reason specified',
						}).catch(() => { });
						const embed = new Discord.MessageEmbed()
							.setColor('#ff0000')
							.setDescription(`${msg.author} was banned from the server`)
							.setTimestamp();
						msg.channel.send(embed).catch(() => { });
					} else {
						msg.reactions.removeAll().catch(() => { });
						return;
					}
				}).catch(() => { msg.reactions.removeAll().catch(() => { }); });
			}
			const args = msg.content.slice(1).split(/ +/);
			if (msg.content.toLocaleLowerCase().startsWith('.give')) {
				const user = msg.mentions.users.first();
				if (!user) return;
				if (user.id == '267835618032222209' || user.id == '165154892447612928' || user.id == '318453143476371456' || user.id == '341067547170308096' || user.id == '77256980288253952') {
					const amount = args[1];
					let rolename;
					if (amount == 15000) { rolename = 'Time Traveller'; }
					else if (amount == 10000) { rolename = 'VIP'; }
					else if (amount == 5000) { rolename = 'Koreaboo'; }
					else if (amount == 500) { rolename = 'Kawaii Potato'; }
					else if (amount == 200) { rolename = 'Babygirl'; }
					else if (amount > 14999 && msg.content.toLocaleLowerCase().includes('time traveller')) { rolename = 'Time Traveller'; }
					else if (amount > 9999 && msg.content.toLocaleLowerCase().includes('vip')) { rolename = 'VIP'; }
					else if (amount > 4999 && msg.content.toLocaleLowerCase().includes('koreaboo')) { rolename = 'Koreaboo'; }
					else if (amount > 499 && msg.content.toLocaleLowerCase().includes('kawaii potato')) { rolename = 'Kawaii Potato'; }
					else if (amount > 199 && msg.content.toLocaleLowerCase().includes('babygirl')) { rolename = 'Babygirl'; }
					else if (amount < 200) { return; }

					msg.channel.awaitMessages(m => m.author.id == '116275390695079945',
						{ max: 1, time: 30000 }).then(collected => {
						collected.first().embeds.forEach((embed) => {
							if (embed.description.includes(' has gifted ')) {
								const PaidRole = msg.guild.roles.cache.find(role => role.name === rolename);
								if (`${PaidRole}`.includes('undefined')) return msg.reply('Something is wrong with the role you entered.');
								const successEmbed = new Discord.MessageEmbed()
									.setDescription(`Congraz! You now have the ${PaidRole} role`)
									.setColor('#b0ff00');
								msg.guild.member(msg.author).roles.add(PaidRole)
									.then(msg.channel.send(successEmbed).catch(() => { })).catch(() => { });
							} else {
								const successEmbed = new Discord.MessageEmbed()
									.setDescription('Seems like you dont have enough Flowers to do that.')
									.setColor('#b0ff00');
								msg.channel.send(successEmbed).catch(() => { });
							}
						});
					}).catch(() => { });
				}
			}
			if (msg.content.startsWith('.shop') && msg.guild.id == '298954459172700181') {
				msg.reply('<:nFingerGun:700775747006234754> hey you! We have an updated version of the role shop. Just type `h!shop`');
			}
			if (msg.channel.type == 'dm') {
				return;
			}
		}
		if (msg.guild.id == '298954459172700181') {
			if (msg.content.toLocaleLowerCase().includes('http://') || msg.content.toLocaleLowerCase().includes('https://')) {
				if (msg.channel.id == '298954459172700181') {
					if (msg.guild.member(msg.author)) {
						if (msg.guild.member(msg.author).roles.cache.has('334832484581769217')) return;
						if (msg.guild.member(msg.author).roles.cache.has('606164114691194900')) return;
						msg.reply('You are not allowed to post links yet. `Needed level: Cookie [20]`\n Please use <#298954962699026432> and <#348601610244587531> instead.').then(send => { setTimeout(function () { send.delete().catch(() => { }); }, 10000); }).catch(() => { });
					}
					if (msg.author.bot) return;
					setTimeout(() => {
						msg.delete().catch(() => { });
					}, 1);
				}
				if (msg.author.id == '305448665496027137') {
					if (msg.content.toLocaleLowerCase().startsWith('.kill')) {
						const args = msg.content.split(/ +/);
						const killedUser = msg.mentions.users.first();
						let link;
						for (let i = 0; args.length > 0; i++) {
							if (args[i].includes('https://').endsWith('.gif')) {
								link = args[i];
							}
						}
						const embed = new Discord.MessageEmbed()
							.setColor('b0ff00')
							.setDescription(`${msg.author} killed ${killedUser} while being too retarded to use the proper commands`)
							.setThumbnail(link);
						msg.channel.send(embed);
						msg.delete();
					}
				}
			}
			if (msg.content.includes(' is now level ')) {
				if (msg.author.id == '159985870458322944') {
					if (msg.guild.id == '298954459172700181') {
						const args = msg.content.split(/ +/);
						const level = args[4].replace(/!/g, '');
						if (level < 40) {
							setTimeout(() => {
								msg.delete().catch(() => { });
							}, 10000);
						}
					}
				}
			}
			if (msg.content.includes(' leveled up!')) {
				if (msg.author.id == '172002275412279296' || msg.author.id == '453643070181867561') {
					setTimeout(() => {
						msg.delete().catch(() => { });
					}, 10000);
				}
			}
			if (msg.author.id == '172002275412279296') {
				if (msg.channel.id !== '298955020232032258' && msg.channel.id !== '756502435572219915' && msg.channel.id !== '315517616447946763') {
					setTimeout(() => {
						msg.delete().catch(() => { });
					}, 10000);
				}
			}
		}
		if (msg.guild.id == '366219406776336385') {
			if (msg.content.toLocaleLowerCase().includes('http://') || msg.content.toLocaleLowerCase().includes('https://')) {
				if (msg.channel.id == '298954459172700181' || msg.channel.id == '644353691096186893' || msg.channel.id == '705095466358145035') {
					if (msg.guild.member(msg.author).roles.cache.has('331556297344548874')) return;
					if (msg.guild.member(msg.author).roles.cache.has('358778201868075008')) return;
					if (msg.guild.member(msg.author).roles.cache.has('606164114691194900')) return;
					if (msg.author.bot) return;
					msg.delete().catch(() => { });
					msg.reply('You are not allowed to post links yet. `Needed level: Donut [40]`\n Please use <#298954962699026432> and <#348601610244587531> instead.').then(send => { setTimeout(function () { send.delete().catch(() => { }); }, 10000); }).catch();
				}
				if (msg.channel.id == '825690575147368479') {
					if (msg.guild.member(msg.author).roles.cache.has('331556297344548874')) return;
					if (msg.guild.member(msg.author).roles.cache.has('358778201868075008')) return;
					if (msg.guild.member(msg.author).roles.cache.has('606164114691194900')) return;
					if (msg.author.bot) return;
					msg.delete().catch(() => { });
					msg.reply('You are not allowed to post links yet. `Needed level: Cookie [40]`').then(send => { setTimeout(function () { send.delete().catch(() => { }); }, 10000); }).catch();

				}
			}
			if (msg.content.includes(' is now level ')) {
				if (msg.author.id == '159985870458322944') {
					if (msg.guild.id == '298954459172700181') {
						const args = msg.content.split(/ +/);
						const level = args[4].replace(/!/g, '');
						if (level < 40) {
							setTimeout(() => {
								msg.delete().catch(() => { });
							}, 10000);
						}
					}
				}
			}
			if (msg.content.includes(' leveled up!')) {
				if (msg.author.id == '172002275412279296' || msg.author.id == '453643070181867561') {
					setTimeout(() => {
						msg.delete().catch(() => { });
					}, 10000);
				}
			}
		}
		if (msg.guild.id == '298954459172700181') {
			if (msg.author.id == '673362753489993749') {
				if (msg.embeds) {
					const embed = msg.embeds[0];
					if (embed) {
						if (embed.description) {
							if (embed.description.includes('got the card! ')) {
								const argsS = embed.description.split(/ +/);
								let user = argsS[1];
								let regex;
								if (user.includes('!')) regex = /<@!/g;
								if (!user.includes('!')) regex = /<@/g;
								user = user.replace(regex, '');
								regex = />/g;
								user = user.replace(regex, '');
								user = client.users.cache.get(user);
								const res = await pool.query(`SELECT * FROM shoob WHERE userid = '${user.id}';`);
								let amount = 0;
								if (res && res.rowCount > 0) {
									amount = +res.rows[0].amount + 1;
									pool.query(`UPDATE shoob SET amount = '${amount}' WHERE userid = '${user.id}';`);
								} else {
									pool.query(`INSERT INTO shoob (userid, amount) VALUES ('${user.id}', '1');`);
								}
								var twentyRole = msg.guild.roles.cache.find(role => role.id === '755962444547096677');
								var fiftyRole = msg.guild.roles.cache.find(role => role.id === '756331367561822258');
								var hundretRole = msg.guild.roles.cache.find(role => role.id === '756331587616112660');
								var fivehundretRole = msg.guild.roles.cache.find(role => role.id === '756332260805967882');
								var kRole = msg.guild.roles.cache.find(role => role.id === '756597164850806896');
								var fivekRole = msg.guild.roles.cache.find(role => role.id === '922327281219809390');

								if (amount > 19) {
									if (!msg.guild.member(user).roles.cache.has('755962444547096677')) {
										msg.guild.member(user).roles.add(twentyRole).catch(() => { });
										const rembed = new Discord.MessageEmbed()
											.setColor('b0ff00')
											.setDescription(`${user} now has the ${twentyRole} role`);
										msg.channel.send(rembed).catch(() => { });
									}
								}
								if (amount > 49) {
									if (!msg.guild.member(user).roles.cache.has('756331367561822258')) {
										msg.guild.member(user).roles.add(fiftyRole).catch(() => { });
										const rembed = new Discord.MessageEmbed()
											.setColor('b0ff00')
											.setDescription(`${user} now has the ${fiftyRole} role`);
										msg.channel.send(rembed).catch(() => { });
									}
								}
								if (amount > 99) {
									if (!msg.guild.member(user).roles.cache.has('756331587616112660')) {
										msg.guild.member(user).roles.add(hundretRole).catch(() => { });
										const rembed = new Discord.MessageEmbed()
											.setColor('b0ff00')
											.setDescription(`${user} now has the ${hundretRole} role`);
										msg.channel.send(rembed).catch(() => { });
									}
								}
								if (amount > 499) {
									if (!msg.guild.member(user).roles.cache.has('756332260805967882')) {
										msg.guild.member(user).roles.add(fivehundretRole).catch(() => { });
										const rembed = new Discord.MessageEmbed()
											.setColor('b0ff00')
											.setDescription(`${user} now has the ${fivehundretRole} role`);
										msg.channel.send(rembed).catch(() => { });
									}
								}
								if (amount > 999) {
									if (!msg.guild.member(user).roles.cache.has('756597164850806896')) {
										msg.guild.member(user).roles.add(kRole).catch(() => { });
										const rembed = new Discord.MessageEmbed()
											.setColor('b0ff00')
											.setDescription(`${user} now has the ${kRole} role`);
										msg.channel.send(rembed).catch(() => { });
									}
								}
								if (amount > 4999) {
									if (!msg.guild.member(user).roles.cache.has('922327281219809390')) {
										msg.guild.member(user).roles.add(fivekRole).catch(() => { });
										const rembed = new Discord.MessageEmbed()
											.setColor('b0ff00')
											.setDescription(`${user} now has the ${fivekRole} role`);
										msg.channel.send(rembed).catch(() => { });
									}
								}
							}
						}
					}
				}
			}
		}
	}
};