const fs = require('fs');

module.exports = {
	name: 'reload',
	requiredPermissions: 0,
	Category: 'Owner',
	aliases: ['r'],
	description: 'Reloads a command',
	usage: 'h!reload [command]',
	/* eslint-disable */
	execute(msg, args, client, prefix, command1, logchannelid, permLevel, errorchannelID ) {
		/* eslint-enable */
		if (!args.length) return msg.channel.send(`You didn't pass any command to reload, ${msg.author}!`);
		if (args[0].toLowerCase() == 'all') {
			const commandFiles = fs.readdirSync('E:/Discord Bots/Ayako/commands').filter(file => file.endsWith('.js'));
			let i = 0;
			let o = 0;
			for (const file of commandFiles) {
				i++;
				delete require.cache[require.resolve(`./${file}`)];
				try {
					const newCommand = require(`./${file}`);
					msg.client.commands.set(newCommand.name.toLowerCase(), newCommand);
				} catch (error) {
					msg.channel.send(`There was an error while reloading a command \`${file.replace('.js', '')}\`:\n\`\`\`${error.stack}\`\`\``);
					i--;
					o++;
				}
			}
			if (o > 0) {
				msg.channel.send(`Reloaded ${i} command files\nFailed to reload ${o} command files`);
			} else {
				msg.channel.send(`Reloaded ${i} command files`);
			}
		} else {
			const commandName = args.slice(0).join(' ').toLowerCase();
			const command = msg.client.commands.get(commandName) || msg.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
			if (!command) return msg.channel.send(`There is no command with name or alias \`${commandName}\`, ${msg.author}!`);
			delete require.cache[require.resolve(`./${command.name.toLowerCase()}.js`)];
			try {
				const newCommand = require(`./${command.name.toLowerCase()}.js`);
				msg.client.commands.set(newCommand.name.toLowerCase(), newCommand);
				msg.channel.send(`Command \`${command.name.toLowerCase()}\` was reloaded!`);
			} catch (error) {
				msg.channel.send(`There was an error while reloading a command \`${command.name.toLowerCase()}\`:\n\`\`\`${error.stack}\`\`\``);
			}
		}
	}
};