const Discord = require('discord.js');
const { pool } = require('../../files/Database');
const ms = require('ms');
const re = /[0-9A-Fa-f]{6}/g;
const arr = {
	'location': {
		'name': 'The Channel the Reminder will be posted in',
		'valid': 'Channel ID, Mention or `DM` for your DMs',
		'type': 'mention',
		'key': ['channelid', 'userid']
	}, 
	'text': {
		'name': 'The Text displayed outside an Embed',
		'valid': 'Any Text',
		'image': 'https://cdn.discordapp.com/attachments/760152457799401532/856624288856670218/unknown.png',
		'type': 'string',
		'key': 'text'
	}, 
	'title': {
		'name': 'The Title displayed on the top of the Embed',
		'valid': 'Any Text (Does not display any Mentions or Markdown formats)',
		'image': 'https://cdn.discordapp.com/attachments/760152457799401532/856624371254951997/unknown.png',
		'type': 'string',
		'key': 'title'
	}, 
	'description': {
		'name': 'The Description displayed inside the Embed',
		'valid': 'Any Text',
		'image': 'https://cdn.discordapp.com/attachments/760152457799401532/856624411690795018/unknown.png',
		'type': 'string',
		'key': 'description'
	}, 
	'private': {
		'name': 'Defines if other Users can view this Reminder by using the `list` command on you',
		'valid': '`yes` or `no`',
		'type': 'boolean',
		'key': 'private'
	}, 
	'interval': {
		'name': 'The interval in which the Reminder is sent',
		'valid': '```every 20 minutes``````every 5 hours``````every 50 seconds```',
		'type': 'time',
		'key': 'interval'
	}, 
	'next': {
		'name': 'The Date and Time the next Reminder is sent',
		'valid': '`YYYY`-`MM`-`DD`\n`today` / `tomorrow`\n`DD` `Month Name` `YYYY` (Has to be GMT/UTC Time)',
		'type': 'date',
		'key': 'nextdate'
	}, 
	'avatar': {
		'name': 'The Avatar of the Reminder Webhook',
		'valid': 'Image/Gif Link',
		'image': 'https://cdn.discordapp.com/attachments/760152457799401532/856624658354929684/unknown.png',
		'type': 'URL',
		'key': 'webhookav'
	}, 
	'name': {
		'name': 'The Name of the Reminder Webhook',
		'valid': 'Any Text (32 Letters or less)',
		'image': 'https://cdn.discordapp.com/attachments/760152457799401532/856624590608269382/unknown.png',
		'type': 'string',
		'key': 'webhookname'
	}, 
	'color': {
		'name': 'The Color of the Embed Sidebar',
		'valid': 'Valid [Hex Color Code](https://imagecolorpicker.com/color-code/b0ff00)',
		'image': 'https://cdn.discordapp.com/attachments/760152457799401532/856624459988074496/unknown.png',
		'type': 'hex',
		'key': 'color'
	}
};

module.exports = {
	async exe(msg) {
		let res;
		let r;
		if (msg.member && msg.member.permissions.has('MANAGE_GUILD')) res = await pool.query(`SELECT * FROM remindersadvanced WHERE guildid = '${msg.guild.id}' OR userid = '${msg.author.id}';`);
		else res = await pool.query(`SELECT * FROM remindersadvanced WHERE userid = '${msg.author.id}';`);
		const embed = new Discord.MessageEmbed()
			.setAuthor('Ayako Advanced Reminder Editing', msg.client.user.displayAvatarURL())
			.setDescription(res.rowCount > 0 ? 'Respond with the reminder ID you want to edit' : 'You have no reminders to edit')
			.setColor('b0ff00');
		for (let i = 0; i < res.rows.length; i++) {
			const r = res.rows[i]; 
			embed.addField(`ID: \`${r.id}\``, `${r.text !== null ? `Text: \`${r.text}\`\n` : ''}${r.title !== null ? `Title: \`${r.title}\`\n` : ''}${r.description !== null ? `Description: \`\`\`${r.description}\`\`\`\n` : ''}${`Interval: \`~${ms(parseInt(r.interval))}\`\n`}`);
		}
		msg.m = await msg.channel.send(embed);
		if (res.rowCount > 0) s1();
		else return;
		async function s1() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return;
			if (collected.size > 0) {
				const answer = collected.first().content.toLowerCase();
				if (answer == 'cancel') return collected.first().react('902269933860290650');
				collected.first().delete().catch(() => {});
				r = res.rows[answer-1];
				if (!r) return msg.reply('That answer was not valid');
				const embed = new Discord.MessageEmbed()
					.setAuthor('Ayako Advanced Reminder Editing', msg.client.user.displayAvatarURL())
					.setDescription('Respond with the Trigger of what you want to edit.\nTest this reminder wiht `test`')
					.addFields(
						{name: 'Editable options:', value: '\u200b', inline: false},
						{name: 'Location', value: `${r.channelid !== null ? `<#${r.channelid}>` : 'DMs'}\nTrigger: \`location\``, inline: true},
						{name: '\u200b', value: '**Message Settings**', inline: false},
						{name: 'Text', value: `${r.text !== null ? `${r.text.replace(/\\20bg/g, '\'')}` : 'none'}\nTrigger: \`text\``, inline: true},
						{name: 'Embed Title', value: `${r.title !== null ? `${r.title.replace(/\\20bg/g, '\'')}` : 'none'}\nTrigger: \`title\``, inline: true},
						{name: 'Embed Description', value: `${r.description !== null ? `${r.description.replace(/\\20bg/g, '\'')}` : 'none'}\nTrigger: \`description\``, inline: true},
						{name: 'Embed Color', value: `${r.color !== null ? `${r.color}` : '#b0ff00'}\nTrigger: \`color\``, inline: true},
						{name: '\u200b', value: '**Privacy Settings**', inline: false},
						{name: 'Private', value: `${r.private !== null ? `${r.private}` : 'none'}\nTrigger: \`private\``, inline: true},
						{name: '\u200b', value: '**Timing Settings**', inline: false},
						{name: 'Interval', value: `${r.interval ? `~${ms(parseInt(r.interval))}` : 'none'}\nTrigger: \`interval\``, inline: true},
						{name: 'Next Send', value: `${r.nextdate ? `${new Date(parseInt(r.nextdate)).toUTCString()}` : 'none'}\nTrigger: \`next\``, inline: true},
						{name: '\u200b', value: '**Webhook Settings**', inline: false},
						{name: 'Webhook Avatar', value: `${r.webhookav !== null ? `${r.webhookav}` : 'none'}\nTrigger: \`avatar\``, inline: true},
						{name: 'Webhook Name', value: `${r.webhookname !== null ? `${r.webhookname.replace(/\\20bg/g, '\'')}` : 'none'}\nTrigger: \`name\``, inline: true},
					)
					.setFooter('Respond with the Trigger of the Setting you want to edit')
					.setColor('b0ff00');
				msg.m.edit(embed);
				s2();
			}
		} 
		async function s2() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return;
			if (collected.size > 0) {
				const answer = collected.first().content.toLowerCase();
				if (answer == 'cancel') return collected.first().react('902269933860290650');
				if (answer == 'test') return test();
				collected.first().delete().catch(() => {});
				const editing = arr[answer];
				if (!editing) {
					msg.reply('That was not a valid answer, please try again');
					return s2();
				}
				const embed = new Discord.MessageEmbed()
					.setAuthor('Ayako Advanced Reminder Editing', msg.client.user.displayAvatarURL())
					.setDescription(`${editing.name}`)
					.addField('Valid Inputs', editing.valid)
					.setColor('b0ff00');
				if (editing.image) embed.setImage(editing.image);
				msg.m.edit(embed);
				s3(editing);
			}
		}
		async function s3(editing) {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return;
			if (collected.size > 0) {
				const answer = collected.first().content.toLowerCase();
				if (answer == 'cancel') return collected.first().react('902269933860290650');
				collected.first().delete().catch(() => {});
				if (editing.type == 'mention') {
					if (answer == 'dm') {
						pool.query(`UPDATE remindersadvanced SET userid = '${msg.author.id}' WHERE id = '${r.id}';\nUPDATE remindersadvanced SET channelid = null WHERE id = '${r.id}';`);
						finish();
					} else {
						const channel = msg.client.channels.cache.get(answer.replace(/\D+/g, ''));
						if (channel) {
							if (channel.guild.id !== msg.guild.id) {
								notValid('You can only set reminders in the server you use this Command in, try again');
								return s3(editing);
							} 
							if (!msg.member.permissions.has('MANAGE_GUILD')) {
								notValid('You dont have enough permissions to do that, try again');
								return s3(editing);
							}
							pool.query(`UPDATE remindersadvanced SET channelid = '${channel.id}' WHERE id = '${r.id}';\nUPDATE remindersadvanced SET userid = null WHERE id = '${r.id}';`);
							finish();
						} else {
							notValid();
							return s3(editing);
						}
					}
				} else if (editing.type == 'string') {
					if (editing.key == 'webhookname') {
						let id;
						if (!r.webhookid) id = await webhookCreate();
						else id = r.webhookid;
						const webhook = await msg.client.fetchWebhook(id).catch(() => {});
						if (!webhook) webhookCreate();
					}
					pool.query(`UPDATE remindersadvanced SET ${editing.key} = '${answer.replace(/'/g, '\20bg')}' WHERE id = '${r.id}';`);
					finish();
				} else if (editing.type == 'boolean') {
					const bool = answer == 'yes' ? true : answer == 'no' ? false : undefined;
					if (bool == undefined) {
						notValid();
						return s3(editing);
					}
					pool.query(`UPDATE remindersadvanced SET ${editing.key} = ${bool} WHERE id = '${r.id}';`);
					finish();
				} else if (editing.type == 'hex') {
					if (!re.test(answer)) {
						notValid();
						return s3(editing);
					} 
					pool.query(`UPDATE remindersadvanced SET ${editing.key} = '${answer}' WHERE id = '${r.id}';`);
					finish();
				} else if (editing.type == 'URL') {
					let id;
					if (!r.webhookid) id = await webhookCreate();
					else id = r.webhookid;
					const webhook = await msg.client.fetchWebhook(id).catch(() => {});
					if (!webhook) webhookCreate();
					if (!answer.startsWith('https://') && !answer.startsWith('http://')) {
						notValid('Thats not a valid Link, try again');
						return s3(editing);
					}
					if (!answer.endsWith('.gif') && !answer.endsWith('.png') && !answer.endsWith('.apng') && !answer.endsWith('.jpg') && !answer.endsWith('.jpeg') && !answer.endsWith('.webm') && !answer.endsWith('.bmp')) {
						notValid('Thats not a valid image Link, try again');
						return s3(editing);
					}
					pool.query(`UPDATE remindersadvanced SET ${editing.key} = '${collected.first().content}' WHERE id = '${r.id}';`);
					finish();
				} else if (editing.type == 'date') {
					date(answer);
				} else if (editing.type == 'time') {
					let interval;
					const answer2 = answer.replace('every ', '');
					const args = answer2.split(/ +/);
					if (isNaN(args[0])) interval = args[0].includes('minute') ? 60000 : args[0].includes('second') ? 1000 : args[0].includes('hour') ? 3600000 : args[0].includes('day') ? 86400000 : args[0].includes('week') ? 604800000 : args[0].includes('month') ? 2592000000 : args[0].includes('year') ? 31557600000 : args[0] == 'no' ? null : undefined;
					else interval = args[1].includes('minute') ? +args[0]*60000 : args[1].includes('second') ? +args[0]*1000 : args[1].includes('hour') ? +args[0]*3600000 : args[1].includes('day') ? +args[0]*86400000 : args[1].includes('week') ? +args[0]*604800000 : args[1].includes('month') ? +args[0]*2592000000 : args[1].includes('year') ? +args[0]*31557600000 : undefined;
					if (interval == undefined) {
						notValid();
						return s3(editing);
					}
					if (interval < 10000 && interval !== null) { 
						notValid('The entered Interval is too short, please choose something longer (minimum 10 seconds)');
						return s3(editing);
					}
					pool.query(`UPDATE remindersadvanced SET interval = '${interval}' WHERE id = '${r.id}';`);
					finish();
				}
			}
		}
		let controldate;
		async function date(answer) {
			if (answer.includes('-')) {
				controldate = Math.floor(new Date(answer).getTime());
			} else if (answer.includes('today')) {
				controldate = Math.floor(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()));
			} else if (answer.includes('tomorrow')) {
				controldate = Math.floor(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds())) + 86400000;
			} else {
				const args = answer.split(/ +/);
				const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
				let month;
				months.forEach(m => {if (m.includes(args[1])) month = m;});
				if (!month) {
					notValid();
					return date(answer);
				}
				const monthNr = months.indexOf(month)+1;
				controldate = Math.floor(Date.UTC(args[2], monthNr, args[0], new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()));
			}
			if (controldate) {
				const embed = new Discord.MessageEmbed()
					.setAuthor('Ayako Advanced Reminder Editing', msg.client.user.displayAvatarURL())
					.setDescription('At what Time should the next reminder be sent?\nValid input examples:\n```in 20 minutes``````at 16:20``````at 5:45 pm```(Also has to be GMT/UTC Time)')
					.setColor('b0ff00');
				msg.m.edit(embed).catch(() => {});
			} else {
				notValid();
				return date(answer);
			}
			time();
		}
		async function time() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return;
			if (collected.size > 0) {
				let answer = collected.first().content.toLowerCase();
				if (answer == 'cancel') return collected.first().react('902269933860290650');
				collected.first().delete().catch(() => {});
				if (answer.includes('in')) {
					if (answer.length > 3) {
						const first = ms(answer.replace('in ', ''));
						if (isNaN(first)) {
							notValid();
							return time();
						}
						pool.query(`UPDATE remindersadvanced SET nextdate = ${+controldate + +first - 7200000} WHERE id = '${r.id}';`);
						finish();
					} else {
						notValid();
						return time();
					}
				} else if (answer.includes('at')) {
					answer = answer.replace('at ', '');
					let hour; let minute;
					if (answer.includes('am')) {
						const args = answer.replace('am', '').split(/:+/);
						if (args[0] == 12) hour = 0;
						else hour = args[0];
						minute = args[1];
					} else if (answer.includes('pm')) {
						const args = answer.replace('pm', '').split(/:+/);
						if (args[0] == 12) hour = 12;
						else hour = +args[0]+12;
						minute = args[1];
					} else {
						const args = answer.replace('am', '').split(/:+/);
						hour = args[0];
						minute = args[1];
					}
					controldate = new Date(new Date(controldate).getFullYear(), new Date(controldate).getMonth(), new Date(controldate).getDay(), +hour, minute);
					console.log(new Date(controldate).toUTCString());
					pool.query(`UPDATE remindersadvanced SET nextdate = ${+controldate - 7200000} WHERE id = '${r.id}';`);
					finish();
				} else {
					notValid();
					return time();
				}
			}
		}
		function notValid(text) {
			if (text) msg.reply(text);
			else msg.reply('This answer was not valid, try again');
		}
		async function finish() {
			controldate = +controldate - 7200000;
			const embed = new Discord.MessageEmbed()
				.setAuthor('Ayako Advanced Reminder Editing', msg.client.user.displayAvatarURL())
				.setDescription('Finished Editing\nRedirecting <a:Loading:780543908861182013>')
				.setColor('b0ff00');
			msg.m.edit(embed).catch(() => {});
			setTimeout(async () => {
				const res2 = await pool.query(`SELECT * FROM remindersadvanced WHERE id = '${r.id}';`);
				if (res2 && res2.rowCount > 0) r = res2.rows[0];
				const embed = new Discord.MessageEmbed()
					.setAuthor('Ayako Advanced Reminder Editing', msg.client.user.displayAvatarURL())
					.setDescription('Respond with the Trigger of what you want to edit.\nTest this reminder with `test`')
					.addFields(
						{name: 'Editable options:', value: '\u200b', inline: false},
						{name: 'Location', value: `${r.channelid !== null ? `<#${r.channelid}>` : 'DMs'}\nTrigger: \`location\``, inline: true},
						{name: '\u200b', value: '**Message Settings**', inline: false},
						{name: 'Text', value: `${r.text !== null ? `${r.text.replace(/\\20bg/g, '\'')}` : 'none'}\nTrigger: \`text\``, inline: true},
						{name: 'Embed Title', value: `${r.title !== null ? `${r.title.replace(/\\20bg/g, '\'')}` : 'none'}\nTrigger: \`title\``, inline: true},
						{name: 'Embed Description', value: `${r.description !== null ? `${r.description.replace(/\\20bg/g, '\'')}` : 'none'}\nTrigger: \`description\``, inline: true},
						{name: 'Embed Color', value: `${r.color !== null ? `${r.color}` : '#b0ff00'}\nTrigger: \`color\``, inline: true},
						{name: '\u200b', value: '**Privacy Settings**', inline: false},
						{name: 'Private', value: `${r.private !== null ? `${r.private}` : 'none'}\nTrigger: \`private\``, inline: true},
						{name: '\u200b', value: '**Timing Settings**', inline: false},
						{name: 'Interval', value: `${r.interval ? `~${ms(parseInt(r.interval))}` : 'none'}\nTrigger: \`interval\``, inline: true},
						{name: 'Next Send', value: `${r.nextdate ? `${new Date(parseInt(r.nextdate)).toUTCString()}` : 'none'}\nTrigger: \`next\``, inline: true},
						{name: '\u200b', value: '**Webhook Settings**', inline: false},
						{name: 'Webhook Avatar', value: `${r.webhookav !== null ? `${r.webhookav}` : 'none'}\nTrigger: \`avatar\``, inline: true},
						{name: 'Webhook Name', value: `${r.webhookname !== null ? `${r.webhookname.replace(/\\20bg/g, '\'')}` : 'none'}\nTrigger: \`name\``, inline: true},
					)
					.setFooter('Respond with the Trigger of the Setting you want to edit')
					.setColor('b0ff00');
				msg.m.edit(embed);
				return s2();
			}, 3000);
		}
		async function webhookCreate() {
			const channel = msg.client.channels.cache.get(r.channelid);
			if (channel) {
				const webhook = await channel.createWebhook(`${msg.client.user.username} Reminder`, {
					avatar: msg.client.user.displayAvatarURL(),
					reason: 'Ayako Reminders'
				}).catch(() => {});
				pool.query(`UPDATE remindersadvanced SET webhookid = '${webhook.id}' WHERE id = ${r.id};`);
				return webhook.id;
			} else return undefined;
		}
		async function test() {
			const channel = msg.client.channels.cache.get(r.channelid);
			if (channel) {
				if (r.text || r.title || r.description) {
					let webhook;
					if (r.webhookid) webhook = await msg.client.fetchWebhook(r.webhookid).catch(() => {});
					let embed;
					if (r.description || r.title)  embed = new Discord.MessageEmbed().setTitle(r.title ? r.title.replace(/\20bg/g, '\'') : null).setDescription(r.description ? r.description.replace(/\20bg/g, '\'') : null).setColor(r.color ? r.color : '#b0ff00');
					else null;
					if (webhook) {
						const body = { 
							username: r.webhookname ? r.webhookname.replace(/\\20bg/g, '\'') : msg.client.user.username,
							avatarURL: r.webhookav ? r.webhookav : msg.client.user.displayAvatarURL(),
							content: r.text ? r.text.replace(/\\20bg/g, '\'') : null,
							embeds: [embed]
						};
						webhook.send(body).catch(() => {});
					} else channel.send(r.text ? r.text.replace(/\\20bg/g, '\'') : null, embed);
					if (r.interval) pool.query(`UPDATE remindersadvanced SET nextdate = '${+r.nextdate + +r.interval}' WHERE channelid = '${r.channelid}' AND id = '${r.id}';`);
					else pool.query(`DELETE FROM remindersadvanced WHERE id = ${r.id};`);
				}
			}
		}
	} 
};


