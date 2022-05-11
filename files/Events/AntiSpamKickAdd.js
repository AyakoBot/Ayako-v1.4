const Discord = require('discord.js');
const { pool } = require('../../files/Database.js');

module.exports = {
	name: 'AntiSpamKickAdd',
	async execute(msg, client) {
		msg.channel.messages.fetch({
			limit: 100,
		}).then((msgs) => {
			const filterBy = msg.author.id;
			msgs = msgs.filter(m => m.author.id === filterBy).array().slice(0, 16);
			msg.channel.bulkDelete(msgs).catch(() => {
				msg.channel.send('Something went wrong, I wasnt able to delete any messages.').catch(() => {});
			}).catch(() => {});
		}).catch(() => {});
		let logchannelid = '';
		const res = await pool.query(`SELECT * FROM logchannel WHERE guildid = '${msg.guild.id}'`);
		if (res && res.rowCount > 0) logchannelid = res.rows[0].modlogs;
		const logchannel = client.channels.cache.get(logchannelid);
		const user = msg.author;
		const kickReason = 'Spam';
		let ReplyEmbed = new Discord.MessageEmbed()
			.setColor('#ff0000')
			.setDescription(`${user} was kicked from the server`)
			.setTimestamp();
		const KickEmbed = new Discord.MessageEmbed()
			.setTitle(`You have been kicked from the server __${msg.guild.name}__`)
			.setColor('#ff0000')
			.setDescription(`Reason: \`\`\`${kickReason}\`\`\``)
			.setTimestamp();
		user.send(KickEmbed).catch(() => {});
		setTimeout(() => {msg.guild.member(user).kick(`Ayako AntiSpam | ${kickReason}`).then(msg.channel.send(ReplyEmbed).catch(() => {})).catch(() => {});}, 1000);
		const KickLogEmbed = new Discord.MessageEmbed()
			.setTitle(user.username + ' was kicked from the server '+ msg.guild.name)
			.setColor('ff0000')
			.setThumbnail(user.displayAvatarURL())
			.setDescription(`${user} was kicked by ${client.user}`)
			.addField('Reason:', kickReason)
			.setTimestamp()
			.setFooter('Kicked user ID: ' +user.id+ ' \nExecutor user ID: '+client.user.id);
		if (logchannel)logchannel.send(KickLogEmbed).catch(() => {});
	}};
