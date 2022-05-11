module.exports = {
	name: 'MessageReactionRemove',
	async execute(msgReaction, user, pool) {
		if (msgReaction.me) return;
		const isUnicode = containsNonLatinCodepoints(msgReaction.emoji.name);
		let res;
		if (!isUnicode) {
			res = await pool.query(`SELECT * FROM reactionroles WHERE msgid = '${msgReaction.message.id}' AND emoteid = '${msgReaction.emoji.id}'`);
		} else {
			res = await pool.query(`SELECT * FROM reactionroles WHERE msgid = '${msgReaction.message.id}' AND emoteid = '${msgReaction.emoji.name}'`);
		}
		if (res) {
			if (res.rows[0]) {
				for (let i = 0; i < res.rowCount; i++) {
					if (msgReaction.message.channel.guild.member(user)) {
						const role = msgReaction.message.channel.guild.roles.cache.get(res.rows[i].roleid);
						if (msgReaction.message.channel.guild.member(user).roles.cache.has(res.rows[i].roleid)) {
							msgReaction.message.channel.guild.member(user).roles.remove(role).catch(() => {});
						}
					}
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