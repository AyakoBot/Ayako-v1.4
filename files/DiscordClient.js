const Discord = require('discord.js');
const client = new Discord.Client({
  messageSweepInterval: 60,
  messageCacheLifetime: 300,
  messageCacheMaxSize: 1000,
  shards: 'auto',
  partials: ['MESSAGE', 'REACTION'],
});
const fs = require('fs');
const auth = require('../auth.json');
const AntiSpam = require('discord-anti-spam');
const DBL = require('dblapi.js');
const dbl = new DBL(auth.topggToken, { webhookPort: 4200, webhookAuth: auth.webhookPW }, client);
const Statcord = require('statcord.js');
console.log('| Required all requirements');

client.login(auth.token).catch((e) => console.log(e));
client.setMaxListeners(Infinity);
console.log('| Logged into client');

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync('/root/Bots/Ayako/commands')
  .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`/root/Bots/Ayako/commands/${file}`);
  client.commands.set(command.name, command);
}
console.log('| Got all Command files');

client.eventfiles = new Discord.Collection();
const executeableFiles = fs.readdirSync('/root/Bots/Ayako/files/Events');
for (const filename of executeableFiles) {
  const executeFiles = require(`/root/Bots/Ayako/files/Events/${filename}`);
  client.eventfiles.set(executeFiles.name, executeFiles);
}
console.log('| Got all Event files');

const antiSpam = new AntiSpam({
  client: client,
});
console.log('| Created AntiSpam client');

const statcord = new Statcord.Client({
  client,
  key: auth.statcordKey,
  postCpuStatistics: true,
  postMemStatistics: true,
  postNetworkStatistics: true,
});
console.log('| Logged into Statcord');

module.exports = { client, antiSpam, statcord, dbl };
