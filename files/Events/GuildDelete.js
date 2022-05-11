const Discord = require('discord.js');
module.exports = {
	name: 'GuildDelete',
	execute(guild, client) {
		if (!guild.memberCount) return;
		const leaveembed = new Discord.MessageEmbed()
			.setDescription('<@&669894051851403294> left a Server')
			.addField('Server Name', guild.name, true)
			.addField('Server ID', guild.id, true)
			.addField('Membercount', guild.memberCount, true)
			.setFooter(`Ayako is now in ${client.guilds.cache.size} servers`)
			.setColor('RED');
		client.channels.cache.get('718181439354437693').send(leaveembed).catch(() => {});
	}
};
