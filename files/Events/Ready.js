const Discord = require('discord.js');
const ms = require('ms');
const APIDiscordBotList = 'https://discordbotlist.com/api/v1/bots/650691698409734151/stats';
const APIDiscordBots = 'https://discord.bots.gg/api/v1/bots/650691698409734151/stats';
const auth = require('../../auth.json');
const fetch = require('node-fetch');

/* unverified yet 
const APIBotsOnDiscord = 'https://bots.ondiscord.xyz/bot-api/bots/650691698409734151/guilds/';
*/

module.exports = {
	name: 'Ready',
	execute(client, statcord, dbl, pool) {
		console.log(`|Logged in as Ayako\n|-> Bot: ${client.user.tag}`);
		console.log(`Login at ${new Date(Date.now()).toLocaleString()}`);
		const allguilds = client.guilds.cache;
		allguilds.forEach(element => {
			element.members.fetch()
				.catch(() => {});
		});
		setInterval(() => {
			const allguilds = client.guilds.cache;
			allguilds.forEach(element => {
				element.members.fetch()
					.catch(() => {});
			});
		}, ms('30m'));
		statcord.autopost();
		setInterval(() => {
			fetch(APIDiscordBots, {
				method: 'post',
				body: JSON.stringify({
					guildCount: client.guilds.cache.size,
				}),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': auth.DBToken
				},
			});
			fetch(APIDiscordBotList, {
				method: 'post',
				body: JSON.stringify({
					'users': client.users.cache.size,
					'guilds': client.guilds.cache.size
				}),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': auth.DBListToken
				},
			});
		}, ms('1h'));
		setInterval(() => {
			const serverCount = client.guilds.cache.size;
			dbl.postStats(serverCount).catch(() => {});
		}, ms('15m'));
		client.user.setActivity('Bot back to full service', { type: 'WATCHING' }).catch(error => {
			const errorchannel = client.channels.cache.get('731421877276508170');
			const errorEmbed = new Discord.MessageEmbed()
				.setColor('RED')
				.setDescription(`Bot Back Status\n\`\`\`${error}\`\`\``)
				.setTimestamp();
			errorchannel.send(errorEmbed);
		});
		setInterval(async () => {
			const eventfile = client.eventfiles.get('TimedManagers');
			eventfile.execute(client, pool); 
		}, 2000);
		setInterval(async () => {
			const eventfile = client.eventfiles.get('VerificationManager');
			eventfile.execute(client, pool); 
		}, 60000);
		setInterval(async () => {
			const eventfile = client.eventfiles.get('GiveawayManager');
			eventfile.execute(client, pool); 
		}, 11000);
		setInterval(async () => {
			if (new Date().getHours() == 0) {
				const eventfile = client.eventfiles.get('NitroManager');
				eventfile.execute(client, pool); 
				pool.query('DELETE FROM toxicitycheck');
			}
		}, ms('1h'));
		setInterval(() => {
			const guild = client.guilds.cache.get('298954459172700181');
			guild.members.prune({ days: 1, reason: 'Unverified' })
				.catch(() => {});
		}, ms('1d'));
		setInterval(() => {
			var random = Math.round(Math.random() * 10);
			if (random > 5) client.user.setActivity(`${client.users.cache.size} users | v1.4- | h!invite`, { type: 'WATCHING' }).catch(() => {});
			if (random < 5) client.user.setActivity(`${client.guilds.cache.size} servers | v1.4- | Default Prefix: h!`, { type: 'WATCHING' }).catch(() => {});
		}, ms('1m'));
	}
};
