const { client, antiSpam, statcord, dbl } = require('./files/DiscordClient.js');
const { pool } = require('./files/Database.js');

client.on('warn', function(info){
	console.log(`warn: ${info}`);
});
client.on('error', function(error){
	console.error(`Client's WebSocket encountered a connection error: ${error}`);
});
client.on('reconnecting', function(){
	console.log('Client tries to reconnect to the WebSocket');
});
pool.on('error', (err) => {
	console.error('Unexpected error on idle client', err);
});
dbl.on('error', e => {
	console.log(`top.gg error\n ${e}`);
});
statcord.on('autopost-start', () => {
	console.log('Started autopost');
});
client.on('message', async (msg) => {
	const eventfile = client.eventfiles.get('MessageEvent');
	eventfile.execute(msg, client, statcord, pool);
	if (client.uptime > 10000) {
		if (!msg._edits || msg._edits == 0) {
			const res = await pool.query('SELECT * FROM stats');
			if (res.rows[0].antispam == true) antiSpam.message(msg);
		}
	}
}); 
client.on('debug', (log) => {
	if(log.startsWith('Swept')) return;
	if(log.toLowerCase().includes('heartbeat')) return;
	console.log(log);
});
antiSpam.on('error', (message, error, type) => {
	console.log(`${message.author.tag} couldn't receive the sanction '${type}', error: ${error}`);
});
antiSpam.on('banAdd', (msg) => {
	const eventfile = client.eventfiles.get('AntiSpamBanAdd');
	eventfile.execute(msg, client);
});
antiSpam.on('kickAdd', (msg) => {
	const eventfile = client.eventfiles.get('AntiSpamKickAdd');
	eventfile.execute(msg, client);
});
antiSpam.on('muteAdd', (msg) => {
	const eventfile = client.eventfiles.get('AntiSpamMuteAdd');
	eventfile.execute(msg, client, pool);
});
antiSpam.on('ofwarnAdd', (msg) => {
	const eventfile = client.eventfiles.get('AntiSpamOfWarnAdd');
	eventfile.execute(msg, client, pool);
});
client.on('guildDelete', (guild) => {
	const eventfile = client.eventfiles.get('GuildDelete');
	eventfile.execute(guild, client);
});
client.on('guildMemberAdd', (msg) => {
	const eventfile = client.eventfiles.get('GuildMemberAdd');
	eventfile.execute(msg, client);
});
client.on('guildMemberRemove', (member) => {
	const eventfile = client.eventfiles.get('GuildMemberRemove');
	eventfile.execute(member, client, pool);
});
client.on('guildMemberUpdate', (oldMember, newMember) => {
	const eventfile = client.eventfiles.get('GuildMemberUpdate');
	eventfile.execute(oldMember, newMember, client, pool);
});
client.on('messageDelete', (msg) => {
	const eventfile = client.eventfiles.get('MessageDelete');
	eventfile.execute(msg, client);
});
client.on('messageUpdate', (oldMsg, newMsg) => {
	const eventfile = client.eventfiles.get('MessageUpdate');
	eventfile.execute(oldMsg, newMsg, client);
});
client.on('guildCreate', (guild) => {
	const eventfile = client.eventfiles.get('GuildCreate');
	eventfile.execute(guild, client);
});
client.on('ready', () => {
	const eventfile = client.eventfiles.get('Ready');
	eventfile.execute(client, statcord, dbl, pool); 
}); 
dbl.webhook.on('ready', hook => {
	console.log(`|Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});
dbl.webhook.on('vote', vote => {
	const eventfile = client.eventfiles.get('Vote');
	eventfile.execute(client, vote, pool);
});
client.on('presenceUpdate', function(oldMember, newMember){
	const eventfile = client.eventfiles.get('PresenceUpdate');
	eventfile.execute(oldMember, newMember, pool);
});
client.on('userUpdate"', function(oldUser, newUser){
	const eventfile = client.eventfiles.get('UserUpdate');
	eventfile.execute(oldUser, newUser, pool);
});
client.on('messageReactionAdd', (messageReaction, user) => {
	const eventfile = client.eventfiles.get('MessageReactionAdd');
	eventfile.execute(client, messageReaction, user, pool);
});
client.on('messageReactionRemove', (messageReaction, user) => {
	const eventfile = client.eventfiles.get('MessageReactionRemove');
	eventfile.execute(messageReaction, user, pool);
});
client.on('raw', (event) =>  {
	const eventfile = client.eventfiles.get('Raw');
	eventfile.execute(client, event, pool);
});
client.on('rateLimit', (event) => {
	console.log(event);
});
client.on('guildMembersChunk', (members, guild, chunk) => {
	console.log(chunk, guild.name, members.size);
});
// eslint-disable-next-line no-undef
process.on('unhandledRejection', error => {
	client.channels.cache.get('731421877276508170')?.send('Error ```'+error.stack+'``` ');
	console.error('Unhandled promise rejection:', error);
});