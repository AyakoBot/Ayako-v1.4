const Discord = require('discord.js');
const { pool } = require('../files/Database.js');
module.exports = {
	name: 'esnipe',
	Category: 'Fun',
	description: 'Snipe the last edited message of a channel',
	usage: 'h!esnipe',
	/* eslint-disable */
	async execute(msg, args, client, prefix, command, logchannelid, permLevel, errorchannelID) {
		/* eslint-enable */
		const embed = new Discord.MessageEmbed()
			.setAuthor('Ayako Dev' , client.user.displayAvatarURL())
			.addField('E-Snipe', 'This Command has been removed as it breaks Discord Developer Privacy Policy.\nhttps://discord.com/developers/docs/legal')
			.setColor('b0ff00');
		msg.channel.send(embed);
	}
};