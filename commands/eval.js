/* eslint-disable */
const Discord = require('discord.js');
const ms = require('ms');
const { pool } = require('../files/Database.js');
const moment = require('moment');
require('moment-duration-format');
const auth = require('../auth.json');
const reg = new RegExp(auth.token, 'g');
const fs = require('fs');

module.exports = {
	name: 'eval',
	requiredPermissions: 0,
	Category: 'Owner',
	description: 'Evaluate any JavaScript Code',
	usage: 'h!eval [code]',
	DMallowed: 'Yes',
	async execute(msg, args, client, prefix, command, logchannelid, permLevel, errorchannelID ) {
		const clean = (text) => { 
			if (typeof text === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)).replace(reg, 'TOKEN'); 
			else return text; }; 
		try { 
			let code = `${args.slice(0).join(' ')}`;
			if (code.startsWith('```')) code = code.replace(/```js/g, '').replace(/```/g, '');
			let evaled = await eval(`(async () => {${code}})()`);
			if (typeof evaled !== 'string') evaled = require('util').inspect(evaled); 
			
			if (evaled.length > 2000) msg.reply('Too long, check console'), console.log(evaled); 
			else msg.reply(`\`\`\`q\n${clean(evaled)}\`\`\``); 
		} catch (err) { 
			if (err.length > 2000) msg.reply('Too long, check console'), console.log(err); 
			else msg.reply(`\`ERROR\` \`\`\`q\n${clean(err)}\n\`\`\``); 
		}
		// eslint-disable-next-line no-unused-vars
		async function send(text) {
			msg.channel.send({content: clean(text)});
		}
	}
};
			/* eslint-enable */
