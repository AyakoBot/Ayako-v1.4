module.exports = {
	name: 'addcmd',
	requiredPermissions: 0,
	Category: 'Owner',
	description: 'If a new Command was created, the Ayako Bot devs will use this command to implement it into Ayako',
	usage: 'h!addcmd [name of the new command]',
	/* eslint-disable */
	execute(msg, args, client, prefix, command, logchannelid, permLevel, errorchannelID ) {
        /* eslint-enable */
		if (!args[0]) {return msg.reply('Please enter a valid command');}
		const newCommand = require(`./${args[0]}.js`);
		try {
			msg.client.commands.set(newCommand.name, newCommand);
			msg.channel.send(`Command \`${newCommand.name}\` was added!`);
		} catch (error) {
			msg.channel.send(`There was an error while adding a command \`${args[0]}\`:\n\`\`\`${error.stack}\`\`\``);
		}
	}};