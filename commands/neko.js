const Discord = require('discord.js');
const { fetchNeko } = require('nekos-best.js');

module.exports = {
	name: 'neko',
	Category: 'Fun',
	description: 'Shows a random Neko picture',
	usage: 'h!neko (category)',
	aliases: ['nekos'],
/* eslint-disable */
  async execute(msg, args, client, prefix, auth, command, logchannelid, permLevel, errorchannelID) {
    /* eslint-enable */
		const arg = args[0] ? args[0].toLowerCase() : 'none';
		const embed = new Discord.MessageEmbed()
			.setFooter('Powered by nekos.best')
			.setColor('b0ff00');
		let image, source;
		if (arg == 'cuddle' || arg == 'feed' || arg == 'hug'  || arg == 'kiss'  || arg == 'poke'  || arg == 'tickle') {
			const neko = await fetchNeko(arg);
			image = neko.url;
			source = neko.artist_href;
		} else {
			const neko = await fetchNeko('nekos');
			image = neko.url;
			source = neko.artist_href;
		}
		embed.setImage(image)
			.setAuthor('Random Neko', 'https://ayakobot.com', source);
		msg.channel.send(embed);
	}
};