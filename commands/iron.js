module.exports = {
	name: 'iron',
	ThisGuildOnly: ['692452151112368218'],
	description: 'Gives a User <@&724669941797617796> if they have the Role <@&746657849039388682>',
	usage: 'h!iron [user ID or Mention]',
	/* eslint-disable */
	execute(msg, args, client, prefix, command, logchannelid, permLevel, errorchannelID ) {
		/* eslint-enable */
		if (msg.author.id !== '513413045251342336' && msg.author.id !== '318453143476371456') return;
		const user = args[0] ? client.users.cache.get(args[0].replace(/\D+/g, '')) : undefined;
		if (!user) return msg.reply('You need to enter a User');
		const member = msg.guild.members.cache.get(user.id);
		if (member.roles.cache.has('746657849039388682')) {
			member.roles.add('724669941797617796');
			member.roles.remove('746657849039388682');
			msg.channel.send(`<:Tick:902269933860290650> Gave ${user} the Iron Rank`);
		} else msg.reply('This User does not have the Visitor Rank');
	}
};