module.exports = {
	name: 'reloadevent',
	requiredPermissions: 0,
	Category: 'Owner',
	aliases: ['rv'],
	description: 'Reloads an Event',
	usage: 'h!reloadevent [event name]',
	/* eslint-disable */
	execute(msg, args, client, prefix, command, logchannelid, permLevel, errorchannelID ) {
		/* eslint-enable */
		if (!args.length) return msg.channel.send(`You didn't pass any event to reload, ${msg.author}!`);
		const EventName = args.slice(0).join(' ');
		const event = msg.client.eventfiles.get(EventName);
        
		if (!event) return msg.channel.send(`There is no event with name \`${EventName}\`, ${msg.author}!`);
		delete require.cache[require.resolve(`../files/Events/${event.name}.js`)];
		try {
			const newEvent = require(`../files/Events/${event.name}.js`);
			msg.client.eventfiles.set(newEvent.name, newEvent);
			msg.channel.send(`Event \`${event.name}\` was reloaded!`);
		} catch (error) {
			msg.channel.send(`There was an error while reloading a event \`${event.name}\`:\n\`\`\`${error.stack}\`\`\``);
		}
	}};