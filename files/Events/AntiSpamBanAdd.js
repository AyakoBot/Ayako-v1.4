const Discord = require('discord.js');
const { pool } = require('../../files/Database.js');

module.exports = {
	name: 'AntiSpamBanAdd',
	async execute(msg, client) {
		msg.channel.messages.fetch({
			limit: 100,
		}).then((msgs) => {
			const filterBy = msg.author.id;
			msgs = msgs.filter(m => m.author.id === filterBy).array().slice(0, 18);
			msg.channel.bulkDelete(msgs).catch(() => {
				msg.channel.send('Something went wrong, I wasnt able to delete any messages.').catch(() => {});
			});
		}).catch(() => {});
		const user = msg.author;
		const banReason = 'Spam';
		let logchannelid = '';
		const res = await pool.query(`SELECT * FROM logchannel WHERE guildid = '${msg.guild.id}'`);
		if (res && res.rowCount > 0) logchannelid = res.rows[0].modlogs;
		const logchannel = client.channels.cache.get(logchannelid);
		if (msg.guild.member(user)) {
			if (msg.guild.id == '298954459172700181' || msg.guild.id == '366219406776336385') {
				var BannedEmbed = new Discord.MessageEmbed()
					.setTitle(`You have been banned from the server __${msg.guild.name}__`)
					.setColor('#ff0000')
					.setDescription(`Reason: \`\`\`${banReason}\`\`\``)
					.addField('You can appeal for your punishment here:', 'https://docs.google.com/forms/d/1MMqfbW8G2Ihfhn-Zm7UkR6UfnrNj4vS8gyivZhGl2_E/')
					.setTimestamp();
			} else {
				BannedEmbed = new Discord.MessageEmbed()
					.setTitle(`You have been banned from the server __${msg.guild.name}__`)
					.setColor('#ff0000')
					.setDescription(`Reason: \`\`\`${banReason}\`\`\``)
					.setTimestamp();
			}
			user.send(BannedEmbed).catch(() => {});
		}
		setTimeout(() => {
			msg.guild.members.ban(user, {
				days: 1,
				reason: `Ayako AntiSpam | ${banReason}`,
			}).catch(() => {});
		}, 1000);
		var ReplyEmbed = new Discord.MessageEmbed()
			.setColor('#ff0000')
			.setDescription(`${user} was banned from the server`)
			.setTimestamp();
		msg.channel.send(ReplyEmbed).catch(() => {});
		var BanLogEmbed = new Discord.MessageEmbed()
			.setTitle(user.username + ' was banned from the server '+ msg.guild.name)
			.setColor('ff0000')
			.setThumbnail(user.displayAvatarURL())
			.setDescription(`${user} was banned by ${client.user}`)
			.addField('Reason:', banReason)
			.setTimestamp()
			.setFooter('Banned user ID: ' +user.id+ ' \nExecutor user ID: '+client.user.id);
		if (logchannel)logchannel.send(BanLogEmbed).catch(() => {});
	}};
