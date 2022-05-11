const Discord = require('discord.js');
const { pool } = require('../../files/Database');
const ms = require('ms');

module.exports = {
	async exe(msg) {
		let res;
		if (msg.member && msg.member.permissions.has('MANAGE_GUILD')) res = await pool.query(`SELECT * FROM remindersadvanced WHERE guildid = '${msg.guild.id}' OR userid = '${msg.author.id}';`);
		else res = await pool.query(`SELECT * FROM remindersadvanced WHERE userid = '${msg.author.id}';`);
		const embed = new Discord.MessageEmbed()
			.setAuthor('Ayako Advanced Reminder Deletion', msg.client.user.displayAvatarURL())
			.setDescription(res.rowCount > 0 ? 'Respond with the reminder ID you want to delete' : 'You have no reminders to delete')
			.setColor('b0ff00');
		for (let i = 0; i < res.rows.length; i++) {
			const r = res.rows[i]; 
			embed.addField(`ID: \`${r.id}\``, `${r.text !== null ? `Text: \`${r.text}\`\n` : ''}${r.title !== null ? `Title: \`${r.title.replace(/\\20bg/g, '\'')}\`\n` : ''}${r.description !== null ? `Description: \`\`\`${r.description.replace(/\\20bg/g, '\'')}\`\`\`\n` : ''}${`Interval: \`~${ms(parseInt(r.interval))}\`\n`}`);
		}
		msg.channel.send(embed);
		if (res.rowCount > 0) s1();
		else return;
		async function s1() {
			const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
			if (!collected) return;
			if (collected.size > 0) {
				const answer = collected.first().content.toLowerCase();
				if (answer == 'cancel') return collected.first().react('902269933860290650');
				const r = res.rows[answer-1];
				if (!r) return msg.reply('That answer was not valid');
				pool.query(`DELETE FROM remindersadvanced WHERE ID = '${r.id}' AND firstdate = '${r.firstdate}';`);
				msg.channel.send('Success! Reminder Deleted');
			}
		} 
	} 
};