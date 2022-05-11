const Discord = require('discord.js');
module.exports = {
	name: '8ball',
	DMallowed: 'Yes',
	Category: 'Fun',
	description: 'Let 8ball decide!',
	usage: 'h!8ball [yes or no question]',
	/* eslint-disable */
	execute(msg, args, client, prefix, command, logchannelid, permLevel, errorchannelID) {
        	/* eslint-enable */
		const random = Math.floor(Math.random() * 15);
		const question = args.slice(0).join(' ');
		if (random == 0) var answer = 'It is certain.';
		if (random == 1) answer = 'It is decidedly so.';
		if (random == 2) answer = 'Without a doubt.';
		if (random == 3) answer = 'Yes - definitely.';
		if (random == 4) answer = 'You may rely on it.';
		if (random == 5) answer = 'As I see it, yes.';
		if (random == 6) answer = 'Most likely.';
		if (random == 7) answer = 'Outlook good.';
		if (random == 8) answer = 'Yes.';
		if (random == 9) answer = 'Signs point to yes.';
		if (random == 10) answer = 'Don\'t count on it.';
		if (random == 11) answer = 'My reply is no.';
		if (random == 12) answer = 'My sources say no.';
		if (random == 13) answer = 'Outlook not so good.';
		if (random == 14) answer = 'Very doubtful.';
		if (random == 15) answer = 'It is certain.';

		const Embed = new Discord.MessageEmbed()
			.setColor('b0ff00')
			.setAuthor(msg.author.username, msg.author.displayAvatarURL())
			.addFields(
				{name: 'Question:', value: `${question}\u200b`, inline: false},
				{name: 'Answer:', value: `${answer}\u200b`, inline: false},
			);
		msg.channel.send(Embed);
	}};