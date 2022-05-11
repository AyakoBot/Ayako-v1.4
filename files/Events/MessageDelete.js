const Discord = require('discord.js');
const { pool } = require('../Database.js');
const hastebin = require('hastebin-gen');
module.exports = {
	name: 'MessageDelete',
	async execute(msg, client) {
		giveawaycheck();
		if (msg.channel.type == 'dm') {
			return;
		}
		if (msg.author) {
			if (msg.author.bot) {
				return;
			}
		} else {
			return;
		}
		const user = msg.author;
		let logchannelid = '';
		const reslog = await pool.query(`SELECT * FROM logchannel WHERE guildid = '${msg.guild.id}'`);
		if (reslog && reslog.rowCount > 0) logchannelid = reslog.rows[0].msglogs;
		const logchannel = client.channels.cache.get(logchannelid);
		if (!logchannel) return;
		if (msg.content) {
			if (msg.content.includes('`')) {
				msg.content = msg.content.replace(/`/g, '\\`');
			}
			if (msg.content.length > 1000) {
				hastebin(msg.content, 'js').then(r => {
					const delEmbed = new Discord.MessageEmbed()
						.setTitle(`Message Deleted in \`#${msg.channel.name}/${msg.channel.id}\``)
						.setAuthor(`${user.tag} / ${user.id}`, user.displayAvatarURL())
						.setDescription(`Guild: \`${msg.guild.name}\` \n **Content:** \n\n Message is too long to be displayed. View it here -> ${r}\n\n${msg.url}`)
						.setTimestamp()
						.setColor('DARK_RED')
						.setFooter(user.id);
					if (logchannel) logchannel.send(delEmbed).catch(() => {});
				}).catch(() => {
					const delEmbed = new Discord.MessageEmbed()
						.setTitle(`Message Deleted in \`#${msg.channel.name}/${msg.channel.id}\``)
						.setAuthor(`${user.tag} / ${user.id}`, user.displayAvatarURL())
						.setDescription(`Guild: \`${msg.guild.name}\` \n **Content:** \n\n Message is too long to be displayed. Couldn't upload the Message to hastebin.`)
						.setTimestamp()
						.setColor('DARK_RED')
						.setFooter(user.id);
					if (logchannel) logchannel.send(delEmbed).catch(() => {});
				});
			} else {
				const delEmbed = new Discord.MessageEmbed()
					.setTitle(`Message Deleted in \`#${msg.channel.name}/${msg.channel.id}\``)
					.setAuthor(`${user.tag} / ${user.id}`, user.displayAvatarURL())
					.setDescription(`Guild: \`${msg.guild.name}\` \n **Content:** \n\n ${msg.content}\n\n${msg.url}`)
					.setTimestamp()
					.setColor('DARK_RED')
					.setFooter(user.id);
				if (logchannel) logchannel.send(delEmbed).catch(() => {});
			}
			if(msg.content.toLocaleLowerCase().includes('https://') || msg.content.toLocaleLowerCase().includes('http://')) {
				return;
			}

		}
		async function giveawaycheck() {
			const res = await pool.query(`SELECT * FROM giveawaysettings WHERE messageid = '${msg.id}'`);
			if (res) {
				if (res.rows[0]) {
					pool.query(`DELETE FROM giveawaysettings WHERE messageid = '${msg.id}'`);
				}
			}
		}
	}
};