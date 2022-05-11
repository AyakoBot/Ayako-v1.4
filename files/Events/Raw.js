module.exports = {
	name: 'Raw',
	async execute(client, event, pool) {
		if (event.t == 'MESSAGE_REACTION_ADD') {
			const res = await pool.query(`SELECT * FROM reactionroles WHERE msgid = '${event.d.message_id}'`);
			if (res) {
				if (res.rows[0]) {
					const channel = client.channels.cache.get(res.rows[0].channelid);
					if (channel.messages.cache.has(event.d.message_id)) return;
					const msg = await channel.messages.fetch(event.d.message_id);
					const isUnicode = containsNonLatinCodepoints(res.rows[0].emoteid);
					let messageReaction;
					if (!isUnicode) {
						messageReaction = msg.reactions.cache.get(res.rows[0].emoteid);
					} else {
						messageReaction = msg.reactions.cache.get(event.d.emoji.name + ':' + event.d.emoji.id);
					}
					let user = client.users.cache.get(event.d.user_id);
					if (!user || !user.id) {
						user = client.users.fetch(event.d.user_id);
					}
					client.emit('messageReactionAdd', messageReaction, user);
				}
			}
		}
		if (event.t == 'MESSAGE_REACTION_REMOVE') {
			const res = await pool.query(`SELECT * FROM reactionroles WHERE msgid = '${event.d.message_id}'`);
			if (res) {
				if (res.rows[0]) {
					const channel = client.channels.cache.get(res.rows[0].channelid);
					if (channel.messages.cache.has(event.d.message_id)) return;
					const msg = await channel.messages.fetch(event.d.message_id);
					const isUnicode = containsNonLatinCodepoints(res.rows[0].emoteid);
					let messageReaction;
					if (!isUnicode) {
						messageReaction = msg.reactions.cache.get(res.rows[0].emoteid);
					} else {
						messageReaction = msg.reactions.cache.get(event.d.emoji.name + ':' + event.d.emoji.id);
					}					
					let user = client.users.cache.get(event.d.user_id);
					if (!user || !user.id) {
						user = client.users.fetch(event.d.user_id);
					}
					client.emit('messageReactionRemove', messageReaction, user);
				}
			}
		}
		if (event.t == 'MESSAGE_DELETE') {
			const res = await pool.query(`SELECT * FROM giveawaysettings WHERE messageid = '${event.d.id}'`);
			if (res) {
				if (res.rows[0]) {
					pool.query(`DELETE FROM giveawaysettings WHERE messageid = '${event.d.id}'`);
				}
			}
		}
		function containsNonLatinCodepoints(s) {
			/* eslint-disable */
			return /[^\u0000-\u00ff]/.test(s);
			/* eslint-enable */
		}
	} 
};