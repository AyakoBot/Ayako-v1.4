const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'VerificationManager',
	async execute(client) {
		return;
		const Animekos = client.guilds.cache.get('298954459172700181');
		Animekos.members.fetch({withPresence: false, time: 600000}).catch(() => {});
		const preverifiedrole = Animekos.roles.cache.get('805315426543599676');
		const guild = Animekos;
		preverifiedrole.members.forEach(async userl => {
			if (!userl) return;
			const user = client.users.cache.get(userl.id);
			if (!user) return;
			if (guild.member(user).roles.cache.has('389470002992119810')) {
				guild.member(user).roles.remove(preverifiedrole).catch(() => {});
			} else {
				if (guild.member(user).joinedTimestamp < (+Date.now() - ms('30m'))) {
					user.createDM().then(dmChannel => {
						dmChannel.send('You have been kicked from `Animekos` because you didnt verify.\nYou can rejoin anytime with this link: discord.gg/animekos').catch(() => {});
					}).catch(() => {});
					setTimeout(() => {
						if (guild.member(user) !== null) {
							guild.member(user).kick('Ayako | Unverified for too long').catch(() => {});
						}
					}, ms('5s'));
				} else {
					var random = Math.round(Math.random() * 15);
					let image;
					let solution;
					if (random == 0) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763208204611223612/Screenshot_2020-10-07_031549.png'; solution = 'swwam';}
					if (random == 1) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763208205828227152/Screenshot_2020-10-07_031602.png'; solution = 'yypdr';}
					if (random == 2) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763208206956363786/Screenshot_2020-10-07_031606.png'; solution = 'vadhx';}
					if (random == 3) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763208208088039434/Screenshot_2020-10-07_031610.png'; solution = 'alwqt';}
					if (random == 4) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763208209313300540/Screenshot_2020-10-07_031615.png'; solution = 'mcpyu';}
					if (random == 5) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763208210747752458/Screenshot_2020-10-07_031619.png'; solution = 'wawja';}
					if (random == 6) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763208212135542824/Screenshot_2020-10-07_031623.png'; solution = 'nsrsa';}
					if (random == 7) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763208214954377236/Screenshot_2020-10-07_031627.png'; solution = 'lplid';}
					if (random == 8) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763568207859548191/Screenshot_2020-10-08_030637.png'; solution = 'ybdqa';}
					if (random == 9) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763568211882016798/Screenshot_2020-10-08_030653.png'; solution = 'nqraa';}
					if (random == 10) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763568212973322270/Screenshot_2020-10-08_030656.png'; solution = 'ajccc';}
					if (random == 11) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763568214121644042/Screenshot_2020-10-08_030659.png'; solution = 'aojnr';}
					if (random == 12) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763568215396974592/Screenshot_2020-10-08_030702.png'; solution = 'tupbb';}
					if (random == 13) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763568216441356288/Screenshot_2020-10-08_030705.png'; solution = 'tyqfs';}
					if (random == 14) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763568217675137044/Screenshot_2020-10-08_030708.png'; solution = 'qrjpi';}
					if (random == 15) {image = 'https://cdn.discordapp.com/attachments/760152457799401532/763568219000274964/Screenshot_2020-10-08_030711.png'; solution = 'vbjlu';}
					const embed = new Discord.MessageEmbed()
						.setImage(image)
						.setTitle('Ayako Verification')
						.setDescription(`<a:ToiletSpin:709805618030182510> **Welcome to Animekos, ${user}!**\n\nPlease type the letters in the image you see below -> Example: \`mhjkl\` \n**The captcha contains 5 Letters, no numbers**`)
						.addField('If you don\'t verify, you won\'t be able to use the server! We have giveaways, events, promo channels, free Nitro, a friendly community and MORE', '\u200b')
						.setColor('b0ff00')
						.setFooter('You cant read the text? Dont panic! A new Captcha code will be sent to you every Minute until you verified');
					user.createDM().then(dmChannel => {dmChannel.send(embed).catch(() => {
						const CatchChannel = client.channels.cache.get('805315908406870044');
						CatchChannel.send(`${user} **Please open your DM's** in order to verify as human. A Captcha will then be sent within 1 Minute.\n **You can close your DM's afterwards**.`)
							.then(send => { setTimeout(function(){  send.delete().catch(() => {});  }, 60000);  });
					});
					dmChannel.awaitMessages(m => m.author.id == user.id,
						{max: 1, time: 60000}).then(collected => {
						if(collected.first().content.toLowerCase() == solution) {
							const embed2 = new Discord.MessageEmbed()
								.setTitle('Nice! You finished the verification')
								.setDescription('**Thank you for verifying!**\n\nPlease go to <#763132467041140737> and introduce yourself! \nDrop a Hi in <#298954459172700181>.\n\nIf you want to claim cards, they spawn in <#756502435572219915>!')
								.setColor('b0ff00')
								.addField('\u200b', '<:AMayakopeek:924071140257841162> Invite Ayako to your server: [click me](https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands)');
							dmChannel.send(embed2).catch(() => {});
							dmChannel.send('🔥 __**The Tribe**__ 🔥\nCome join a friendly anime & flame themed server with over 500 emotes, addicting 24/7 chats and vcs, and giveaways!\nhttps://discord.gg/8EJgFxwRhX').catch(() => {});
							var allrole = guild.roles.cache.find(role => role.id === '389470002992119810');
							guild.member(user).roles.add(allrole).catch(() => {});
							guild.member(user).roles.remove(preverifiedrole).catch(() => {});
						} else {
							dmChannel.send(`That was wrong... Are you a robot? You will get another chance every Minute.\nThe solution was \`${solution}\``).catch(() => {});
						}
					}).catch(() => {});
					}).catch(() => {});
				}
			}
		});
	}
};