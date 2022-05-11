const Discord = require('discord.js');
const { pool } = require('../files/Database');

module.exports = {
	name: 'adminperms',
	Category: 'ModerationAdvanced',
	requiredPermissions: 6,
	description: 'Display the permissions of the current AdminRole',
	usage: 'h!adminperms',
	/* eslint-disable */
	async execute(msg, args, client, prefix, command, logchannelid, permLevel, errorchannelID ) {
        /* eslint-enable */
		const res = await pool.query(`SELECT * FROM modroles WHERE guildid = '${msg.guild.id}'`);
		if (res && res.rowCount > 0 && res.rows[0].adminrole) {
			const role = res.rows[0].adminrole;
			const res2 = await pool.query(`SELECT * FROM modperms WHERE guildid = '${msg.guild.id}' AND type = 'admin'`);
			let ban = '<:Cross:902269073805701211> No';
			let unban = '<:Cross:902269073805701211> No';
			let kick = '<:Cross:902269073805701211> No';
			let mute = '<:Cross:902269073805701211> No';
			let unmute = '<:Cross:902269073805701211> No';
			let clear = '<:Cross:902269073805701211> No';
			let announce = '<:Cross:902269073805701211> No';
			let tempmute = '<:Cross:902269073805701211> No';
			let pardon = '<:Cross:902269073805701211> No';
			let edit = '<:Cross:902269073805701211> No';
			let warn = '<:Cross:902269073805701211> No';
			let giverole = '<:Cross:902269073805701211> No';
			let takerole = '<:Cross:902269073805701211> No';
			if (res2 && res2.rowCount > 0) {
				for (let i = 0; res2.rows.length > i; i++) {
					const r = res2.rows[i];
					if (r.permission == 'ban' && r.granted) ban = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'unban' && r.granted) unban = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'kick' && r.granted) kick = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'mute' && r.granted) mute = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'unmute' && r.granted) unmute = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'clear' && r.granted) clear = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'announce' && r.granted) announce = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'tempmute' && r.granted) tempmute = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'pardon' && r.granted) pardon = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'edit' && r.granted) edit = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'warn' && r.granted) warn = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'takerole' && r.granted) takerole = '<:Tick:902269933860290650> Yes';
					if (r.permission == 'giverole' && r.granted) giverole = '<:Tick:902269933860290650> Yes';
				}
			}
			const Embed = new Discord.MessageEmbed()
				.setTitle('AdminRole permissions')
				.setColor('#b0ff00')
				.setDescription('Edit Role with the command \n`h!setperms [mod/trial/admin] [permission] [deny/allow]`\n Role: <@&'+role+'>')
				.addFields(
					{ name:'Ban Members' , value:ban , inline: true },
					{ name:'Unban Users' , value:unban , inline: true },
					{ name:'Kick Members' , value:kick , inline: true },
					{ name:'Mute Members' , value:mute , inline: true },
					{ name:'Tempmute Members' , value:tempmute , inline: true},
					{ name:'Unmute Members' , value:unmute , inline: true},
					{ name:'Clear Messages', value:clear , inline: true},
					{ name:'Announce' , value:announce , inline: true},
					{ name:'Warn Members' , value:warn , inline: true},
					{ name:'Edit Warnings' , value:edit , inline: true},
					{ name:'Pardon Warnings' , value:pardon , inline: true},
					{ name:'Give Roles' , value:giverole , inline: true},
					{ name:'Take Roles' , value:takerole , inline: true},
				);
			msg.channel.send(Embed);
		} else {
			msg.reply('You have to set a AdminRole before you can use this command.');
		}
	}
};