const Discord = require('discord.js');
const ms = require('ms');
const { pool } = require('../../files/Database');

module.exports = {
	async exe(msg) {
		let channel;
		let text;
		let title;
		let description;
		let interval;
		let controldate;
		const embed = new Discord.MessageEmbed()
			.setAuthor('Ayako Advanced Reminder Creation', msg.client.user.displayAvatarURL())
			.setDescription('Respond with a Channel ID or Mention or `dm` to use DMs')
			.setColor('b0ff00');
		msg.m = await msg.channel.send(embed).catch(() => {});    
		s1();
		async function s1() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return aborted();
			if (collected.size > 0) {
				const answer = collected.first().content.toLowerCase();
				if (answer == 'cancel') return collected.first().react('902269933860290650');
				collected.first().delete().catch(() => {});
				if (answer == 'dm') {
					channel = await msg.author.createDM().catch(() => {
						notValid('Please open your DMs if you want me to send Reminders there, then try again');
						return s1();
					});
					channel.type = 'user';
				} else {
					if (!msg.member.permissions.has('MANAGE_GUILD')) return notValid('You dont have enough permissions to manage this servers reminders `MANAGE_GUILD`');
					channel = msg.client.channels.cache.get(answer.replace(/\D+/g, ''));
					if (!channel) {
						channel = await msg.client.users.fetch(answer.replace(/\D+/g, '')).catch(() => {});
						if (!channel) {
							notValid();
							return s1();
						}
					}
					if (channel.type == 'voice') { 
						notValid('The channel you entered is a Voice Channel, I cant send messages in these. Try again'); 
						return s1();
					}
					if (channel.guild.id !== msg.guild.id) {
						notValid('The Channel you want this reminder in is not in this Server, try again.');
						return s1();
					}
				}
				if (!channel) {
					notValid();
					return s1();
				}
				const embed = new Discord.MessageEmbed()
					.setAuthor('Ayako Advanced Reminder Creation', msg.client.user.displayAvatarURL())
					.setDescription('Next respond with a Text or `none` if you dont want any')
					.setColor('b0ff00')
					.setImage('https://cdn.discordapp.com/attachments/760152457799401532/856624288856670218/unknown.png');
				msg.m.edit(embed).catch(() => {});   
				s2();
			}
		}
		async function s2() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return aborted();
			if (collected.size > 0) {
				text = collected.first().content.toLowerCase();
				if (text == 'cancel') return collected.first().react('902269933860290650');
				collected.first().delete().catch(() => {});
				if (text == 'none') text = null;
				const embed = new Discord.MessageEmbed()
					.setAuthor('Ayako Advanced Reminder Creation', msg.client.user.displayAvatarURL())
					.setDescription('Great! Do you want an Embed attached to the reminder?\nReply with `yes` or `no`')
					.setColor('b0ff00');
				msg.m.edit(embed).catch(() => {});   
				s3();
			} 
		}
		async function s3() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return aborted();
			if (collected.size > 0) {
				const answer = collected.first().content.toLowerCase();
				if (answer == 'cancel') return collected.first().react('902269933860290650');
				collected.first().delete().catch(() => {});
				if (answer == 'yes') {
					const embed = new Discord.MessageEmbed()
						.setAuthor('Ayako Advanced Reminder Creation', msg.client.user.displayAvatarURL())
						.setDescription('Okay, then we need to Create a simple Embed\nChoose a Title.\n(Notice: Embed Titles dont accept Mentions, Emotes or Markdown formats (underlines, strikethrough etc.))')
						.setColor('b0ff00')
						.setImage('https://cdn.discordapp.com/attachments/760152457799401532/856624371254951997/unknown.png');
					msg.m.edit(embed).catch(() => {});   
					embedCreation1();
				} else {
					const embed = new Discord.MessageEmbed()
						.setAuthor('Ayako Advanced Reminder Creation', msg.client.user.displayAvatarURL())
						.setDescription('No Embed? Alright, now choose a Date for the Reminder to start\nDate input:\n`YYYY`-`MM`-`DD`\n`today` / `tomorrow`\n`DD` `Month Name` `YYYY`\n\n**Notice:**\nDate input MUST be GMT/UTC\nCurrent GMT/UTC Time: `'+new Date().toUTCString()+'`')
						.setColor('b0ff00');
					msg.m.edit(embed).catch(() => {});   
					date();
				}
			} 
		}
		async function embedCreation1() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return aborted();
			if (collected.size > 0) {
				title = collected.first().content.toLowerCase();
				if (title == 'cancel') return collected.first().react('902269933860290650');
				collected.first().delete().catch(() => {});
				const embed = new Discord.MessageEmbed()
					.setAuthor('Ayako Advanced Reminder Creation', msg.client.user.displayAvatarURL())
					.setDescription('Now choose a Description')
					.setColor('b0ff00')
					.setImage('https://cdn.discordapp.com/attachments/760152457799401532/856624411690795018/unknown.png');
				msg.m.edit(embed).catch(() => {});   
				embedCreation2();
			} 
		}
		async function embedCreation2() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return aborted();
			if (collected.size > 0) {
				description = collected.first().content.toLowerCase();
				if (description == 'cancel') return collected.first().react('902269933860290650');
				collected.first().delete().catch(() => {});
				const embed = new Discord.MessageEmbed()
					.setAuthor('Ayako Advanced Reminder Creation', msg.client.user.displayAvatarURL())
					.setDescription('Amazing, Your Embed is done. Now choose a Date for the Reminder to start\nDate input:\n`YYYY`-`MM`-`DD`\n`today` / `tomorrow`\n`DD` `Month Name` `YYYY`\n\n**Notice:**\nDate input MUST be GMT/UTC\nCurrent GMT/UTC Time: `'+new Date().toUTCString()+'`')
					.setColor('b0ff00');
				msg.m.edit(embed).catch(() => {});   
				date();
			} 
		}
		async function date() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return aborted();
			if (collected.size > 0) {
				const answer = collected.first().content.toLowerCase();
				if (answer == 'cancel') return collected.first().react('902269933860290650');
				collected.first().delete().catch(() => {});
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
						return date();
					}
					const monthNr = months.indexOf(month)+1;
					controldate = Math.floor(Date.UTC(args[2], monthNr, args[0], new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()));
				}
				if (controldate) {
					const embed = new Discord.MessageEmbed()
						.setAuthor('Ayako Advanced Reminder Creation', msg.client.user.displayAvatarURL())
						.setDescription('At what Time should the first reminder be sent?\nValid input examples:\n```in 20 minutes``````at 16:20``````at 5:45 pm```(Also has to be GMT/UTC Time)')
						.setColor('b0ff00');
					msg.m.edit(embed).catch(() => {});
					time();
				} else {
					notValid();
					return date();
				}
			} 
		}
		async function time() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return aborted();
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
						controldate = +controldate + +first;
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
				} else {
					notValid();
					return time();
				}
				const embed = new Discord.MessageEmbed()
					.setAuthor('Ayako Advanced Reminder Creation', msg.client.user.displayAvatarURL())
					.setDescription('Last step! How often should I send this reminder (if repeated at all)\nValid input examples:\n```every 20 minutes``````every day``````every 6 hours``` or `no` if you want it sent only once')
					.setColor('b0ff00');
				msg.m.edit(embed).catch(() => {});
				setinterval();
			}
		}
		async function setinterval() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return aborted();
			if (collected.size > 0) {
				let answer = collected.first().content.toLowerCase();
				if (answer == 'cancel') return collected.first().react('902269933860290650');
				collected.first().delete().catch(() => {});
				answer = answer.replace('every ', '');
				const args = answer.split(/ +/);
				if (isNaN(args[0])) interval = args[0].includes('minute') ? 60000 : args[0].includes('second') ? 1000 : args[0].includes('hour') ? 3600000 : args[0].includes('day') ? 86400000 : args[0].includes('week') ? 604800000 : args[0].includes('month') ? 2592000000 : args[0].includes('year') ? 31557600000 : args[0] == 'no' ? null : undefined;
				else interval = args[1].includes('minute') ? +args[0]*60000 : args[1].includes('second') ? +args[0]*1000 : args[1].includes('hour') ? +args[0]*3600000 : args[1].includes('day') ? +args[0]*86400000 : args[1].includes('week') ? +args[0]*604800000 : args[1].includes('month') ? +args[0]*2592000000 : args[1].includes('year') ? +args[0]*31557600000 : undefined;
				if (interval == undefined) {
					notValid();
					return setinterval();
				}
				if (interval < 10000 && interval !== null) { 
					notValid('The entered Interval is too short, please choose something longer (minimum 10 seconds)');
					return setinterval();
				}
				finish();
			}
		}
		async function finish() {
			controldate = +controldate - 7200000;
			const embed = new Discord.MessageEmbed()
				.setAuthor('Ayako Advanced Reminder Creation', msg.client.user.displayAvatarURL())
				.setDescription('You finished the setup!\nFor even MORE advanced options (like: custom avatar, name, more embed stuff, private) visit `h!reminder advanced` -> `edit`')
				.addFields(
					{name: 'Start Date', value: new Date(controldate).toUTCString()+' (in ~ '+ms(controldate-Date.now())+')', inline: false},
					{name: 'Interval', value: '~'+ms(interval)},
				)
				.setColor('b0ff00');
			msg.m.edit(embed).catch(() => {});
			pool.query(`INSERT INTO remindersadvanced (guildid, channelid, text, title, description, firstdate, nextdate, interval, private) VALUES (${channel.type !== 'user' ? `${msg.guild.id}` : null}, '${channel.id}', ${text ? `'${text.replace(/'/g, '\20bg')}'` : null}, ${title ? `'${title.replace(/'/g, '\20bg')}'` : null}, ${title ? `'${description.replace(/'/g, '\20bg')}'` : null}, '${controldate}', '${controldate}', '${interval}', false);`);
		}
		function notValid(text) {
			if (text) msg.reply(text);
			else msg.reply('This answer was not valid, try again');
		}
		function aborted(text) {
			if (text) msg.reply(text);
			else msg.channel.send('Reminder creation Aborted');
		}
	} 
};