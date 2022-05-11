module.exports = {
	name: 'addevent',
	requiredPermissions: 0,
	Category: 'Owner',
	description: 'If a new Event was created, the Ayako Bot devs will use this command to implement it into Ayako',
	usage: 'h!addevent [name of the new event]',
	/* eslint-disable */
	execute(msg, args, client, prefix, command, logchannelid, permLevel, errorchannelID ) {
        /* eslint-enable */
		if (!args[0]) {return msg.reply('Please enter a valid command');}
		const newEvent = require(`../files/Events/${args[0]}.js`);
		try {
			msg.client.eventfiles.set(newEvent.name, newEvent);
			msg.channel.send(`Command \`${newEvent.name}\` was added!`);
		} catch (error) {
			msg.channel.send(`There was an error while adding a event \`${args[0]}\`:\n\`\`\`${error.stack}\`\`\``);
		}
	}};