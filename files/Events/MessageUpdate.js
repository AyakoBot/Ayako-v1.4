const Discord = require('discord.js');
const hastebin = require('hastebin-gen');
const { pool } = require('../Database.js');
module.exports = {
	name: 'MessageUpdate',
	async execute(oldMsg, newMsg, client) {
		if (oldMsg.channel.type == 'dm') {
			return;
		}
		if (oldMsg.author) {
			if (oldMsg.author.bot) {
				return;
			} else {
				log();
				let wascmd = await wasCommand();
				editCommand(wascmd);
				if (oldMsg.author.id == '318453143476371456') {
					if (oldMsg.mentions.crosspostedChannels !== newMsg.mentions.crosspostedChannels) {
						console.log(oldMsg.mentions.crosspostedChannels);
						console.log(newMsg.mentions.crosspostedChannels);
					}
				}
			}
		}
		async function editCommand(wascmd) { 
			let prefix2;
			let prefix1 = 'h!';
			if (wascmd == false) {
				if (newMsg.channel.type !== 'dm') {
					const result = await pool.query(`SELECT prefix FROM prefix WHERE guildid = '${newMsg.guild.id}'`);
					if (result) {
						if (result.rows[0]) {
							prefix2 = result.rows[0].prefix;
						} else {
							prefix2 = prefix1;
						}
					} else {
						prefix2 = prefix1;
					}
				} else {
					prefix2 = prefix1;
				}
				if(newMsg.content.toLowerCase().startsWith(prefix1) || newMsg.content.toLowerCase().startsWith(prefix2)) {
					let prefix;
					if(newMsg.content.toLowerCase().startsWith(prefix1)) {
						prefix = prefix1;
					}
					else {
						prefix = prefix2;
					}	
					if (!prefix) return;
					const args = newMsg.content.slice(prefix.length).split(/ +/);
					const commandName = args.shift().toLowerCase();
					const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
					if (commandName == 'interactions') return;
					if (!command) return;
					client.emit('message', newMsg);
				}
			}
		}
		async function log() {
			let logchannelid = '';
			const reslog = await pool.query(`SELECT * FROM logchannel WHERE guildid = '${newMsg.guild.id}'`);
			if (reslog && reslog.rowCount > 0) logchannelid = reslog.rows[0].msglogs;
			else return;
			const logchannel = client.channels.cache.get(logchannelid);
			const user = oldMsg.author;
			let Newmessage = newMsg;
			let Oldmessage = oldMsg;
			if (newMsg.content.length > 200) {
				hastebin(newMsg.content, 'js').then(r => {
					Newmessage = `Message is too long to be displayed. View it here -> ${r}`;
				}).catch(() => {Newmessage = 'Couldn\'t upload the Message to hastebin.';});  
			}
			if (oldMsg.content.length > 200) {
				hastebin(oldMsg.content, 'js').then(r => {
					Oldmessage = `Message is too long to be displayed. View it here -> ${r}`;
				}).catch(() => {Oldmessage = 'Couldn\'t upload the Message to hastebin.';});
			}
			const delEmbed = new Discord.MessageEmbed()
				.setTitle(`Message Edited in \`#${oldMsg.channel.name}\``)
				.setAuthor(`${user.tag} / ${user.id}`, user.displayAvatarURL())
				.setDescription(`Guild: \`${oldMsg.guild.name}\` \n\n**Old Message:**\n${Oldmessage}\n\n**New Message:**\n${Newmessage}\n\n${newMsg.url}`)
				.setTimestamp()
				.setColor('DARK_RED')
				.setFooter(user.id);
			if(logchannel) logchannel.send(delEmbed).catch(() => {});

			if (newMsg.content.includes('http://') || newMsg.content.includes('https://')){
				if (newMsg.content.includes('discord.gg')) {
					if (newMsg.channel.id == '366239248900292618' || newMsg.channel.id == '366237152448610305' || newMsg.channel.id == '366220160413204490' || newMsg.channel.id == '439563435437719582' || newMsg.channel.id == '765732828892758026' || newMsg.author.id == '267835618032222209') return;
					if (newMsg.guild.id == '366219406776336385') {
						newMsg.delete().catch(() => {});
					}
				}
				if (oldMsg.channel.id == '298954459172700181' || oldMsg.channel.id == '644353691096186893' || oldMsg.channel.id == '705095466358145035') {
					if(oldMsg.member.roles.cache.has('334832484581769217')) return;
					if(oldMsg.member.roles.cache.has('606164114691194900')) return;
					setTimeout(() => {
						newMsg.delete().catch(() => {});
					}, 1);
					newMsg.reply('You are not allowed to post links yet. `Needed level: Cookie [20]`\n Please use <#298954962699026432> and <#348601610244587531> instead.').then(send => { setTimeout(function(){  send.delete();  }, 10000);  }).catch();
				}
			}
		}
		async function wasCommand() { 
			let all = [];
			for (let i = 0; i < newMsg._edits.length; i++) {
				const part =  await checker(newMsg._edits[i]);
				all.push(part);
			}
			if (all.includes(true)) {
				return true;
			} else {
				return false;
			}
		}
		async function checker(edit) { 
			let prefix2;
			let prefix1 = 'h!';
			if (edit.channel.type !== 'dm') {
				const result = await pool.query(`SELECT prefix FROM prefix WHERE guildid = '${edit.guild.id}'`);
				if (result) {
					if (result.rows[0]) {
						prefix2 = result.rows[0].prefix;
					} else {
						prefix2 = prefix1;
					}
				} else {
					prefix2 = prefix1;
				}
			} else {
				prefix2 = prefix1;
			}
			if(edit.content.toLowerCase().startsWith(prefix1) || edit.content.toLowerCase().startsWith(prefix2)) {
				let prefix;
				if(edit.content.toLowerCase().startsWith(prefix1)) {
					prefix = prefix1;
				}
				else {
					prefix = prefix2;
				}	
				if (!prefix) return false;
				const args = edit.content.slice(prefix.length).split(/ +/);
				const commandName = args.shift().toLowerCase();
				const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
				if (commandName == 'interactions') return false;
				if (!command) return false;
				return true;
			} else {
				return false;
			}
		}
	}
};
