const Discord = require('discord.js');
module.exports = {
	name: 'GuildMemberUpdate',
	async execute(oldMember, newMember, client, pool) {
		if (oldMember.roles !== newMember.roles) {
			nitrohandling();
			const res = await pool.query(`SELECT * FROM giveawaysettings WHERE guildid = '${oldMember.guild.id}' AND requirement = 'role'`);
			if (res.rows !== 0) {
				let deleteit1 = [];
				let deleteit2 = [];
				for (let i = 0; i < res.rowCount; i++) {
					const roleid = res.rows[i].reqroleid;
					const role = oldMember.guild.roles.cache.get(roleid);
					if (oldMember.roles.cache.size < 1 || newMember.roles.cache.size < 1) return;
					oldMember.roles.cache.forEach(element => {
						if ((role && element) && element.id == role.id) {deleteit1.push(element.id);}
					});
					newMember.roles.cache.forEach(element => {
						if ((role && element) && element.id == role.id) {deleteit2.push(element.id);}
					});
					let willdelete;
					if (role && ((deleteit1.indexOf(role.id) !== -1) == true) && ((deleteit2.indexOf(role.id) !== -1) == false)) {willdelete = true;} else {willdelete = false;}
					if (willdelete == true) {
						const msgid = res.rows[i].messageid;
						const channelid = res.rows[i].channelid;
						client.channels.cache.get(channelid).messages.fetch(msgid).then((m) => {
							if (m && m.id) {
								const allReactions = m.reactions.cache.first().users.cache.map(u => u.id);
								if (allReactions.includes(newMember.user.id)) m.reactions.resolve('🎉').users.remove(newMember.user).catch(() => {});
								if (!res.rows[i].ended) {
								newMember.user.createDM().then((dmChannel) => {
									const embed = new Discord.MessageEmbed()
										.setTitle('Entry Removed')
										.setDescription(`Your entry for a Giveaway in [${newMember.guild.name}](https://discordapp.com/channels/${newMember.guild.id}/${channelid}/${msgid} "Click to jump to giveaway") was removed since you lost the role \`${role.name}\``)
										.setColor('f60909');
									dmChannel.send(embed).catch(() => {});
								});
								}
							}
						}).catch(() => {});
					}
				}
			}
		}
		async function nitrohandling() {  
			const result = await pool.query(`SELECT * FROM nitrosettings WHERE guildid = '${oldMember.guild.id}'`);
			if (result.rowCount == 0) return;
			if (result.rowCount !== 0) {
				const nitrologchannelid = result.rows[0].nitrologchannelid;
				const NitroLogChannel = client.channels.cache.get(nitrologchannelid);
				const guild = oldMember.guild;
				const Role = guild.roles.cache.get(result.rows[0].boosterroleid);
				if (Role && Role.id) {
					if (oldMember.roles.cache.has(Role.id) && !newMember.roles.cache.has(Role.id)) {
						let WhenBoosted;
						const res = await pool.query(`SELECT days FROM nitroboosters WHERE userid = '${newMember.user.id}' AND guildid = '${guild.id}'`);
						if (res.rowCount == 0) WhenBoosted = 0;
						if (res.rowCount !== 0) WhenBoosted = res.rows[0].days;
						const StoppedBoostEmbed = new Discord.MessageEmbed()
							.setTitle(`${newMember.user.username} stopped boosting ${newMember.guild.name}`)
							.setColor('b0ff00')
							.setDescription(`${newMember} stopped boosting after ${WhenBoosted} days.`)
							.setTimestamp();
						if (NitroLogChannel) NitroLogChannel.send(StoppedBoostEmbed).catch(() => {});
					} else if (!oldMember.roles.cache.has(Role.id) && newMember.roles.cache.has(Role.id)) {
						const StartBoostEmbed = new Discord.MessageEmbed()
							.setTitle(`${newMember.user.username} just boosted ${newMember.guild.name}`)
							.setColor('b0ff00')
							.setDescription(`${newMember} just started boosting.`)
							.setTimestamp();
						if (NitroLogChannel) NitroLogChannel.send(StartBoostEmbed).catch(() => {});
					}
				}
			}
		}
	}
};

