const Discord = require('discord.js');
module.exports = {
	name: 'GuildMemberRemove',
	execute(member, client, pool) {
		if (member.guild.id == '298954459172700181') {
			const channel = client.channels.cache.get('317410162061344768');
			channel.send(`${member.user} has left! <:SadButStrong:670154524190834699>`).catch(() => {});
		}
		let guild;
		let reqGuild;
		let requirement;
		let invitelink;
		let channelid;
		let messageid;
		pool.query(`SELECT * FROM giveawaysettings WHERE reqserverid = '${member.guild.id}'`, (err, result) => {
			const restext = `${result.rows[0]}`;
			if (restext == 'undefined') {
				return;
			} else {
				requirement = result.rows[0].requirement;
				if (requirement.includes('guild')) {reqGuild = client.guilds.cache.get(result.rows[0].reqserverid); invitelink = result.rows[0].invitelink;}
				guild = client.guilds.cache.get(result.rows[0].guildid);
				channelid = result.rows[0].channelid;
				messageid = result.rows[0].messageid;
				finish(guild, reqGuild, invitelink, channelid, messageid);
			}
		});
		function finish(guild, reqGuild, invitelink, channelid, messageid) {
			if (!channelid) return;
			const channel = client.channels.cache.get(channelid);
			if (channel) {
				channel.messages.fetch(messageid).then((m) => {
					const allReactions = m.reactions.cache.first().users.cache.map(u => u.id);
					if (allReactions.includes(member.user.id)) {
						member.user.createDM().then((dmChannel) => {
							const embed = new Discord.MessageEmbed()
								.setTitle(`You left ${reqGuild.name}`)
								.setDescription(`You may not be able to claim your prize in [${guild.name}](https://discordapp.com/channels/${guild.id}/${channelid}/${messageid} "Click to view giveaway") if you dont rejoin [${reqGuild.name}](${invitelink} "Click to rejoin Server").`)
								.setColor('f60909');
							dmChannel.send(embed).catch(() => {});
						}).catch(() => {});
					}
				});
			}
		}
		if (member.guild.id == '801413120705822761') {
			const embed = new Discord.MessageEmbed()
				.setTitle(`${member.user.username} has left the server.`)
				.setDescription('Farewell, may the lanterns which brought you to us guide you in your future journeys')
				.setImage('https://cdn.discordapp.com/attachments/801413121142554665/811193320948760586/unknown.png')
				.setColor('b0ff00');
			client.channels.cache.get('801413121142554666').send(embed);
		}
		if (member.guild.id == '847490037968666654') {
			const embed = new Discord.MessageEmbed()
				.setDescription(`${member.user} has left`)
				.setColor('RANDOM');
			client.channels.cache.get('885584958771589150').send(embed);
		}
	}
};
