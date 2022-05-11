module.exports = {
	async exe(msg) {
		const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000});
		if (!collected) return;
		if (collected.size > 0) {
			const answer = collected.first().content.toLowerCase();
			if (answer == 'cancel') return collected.first().react('902269933860290650');
			collected.first().delete().catch(() => {});
			if (answer == 'create') require('./create').exe(msg);
			else if (answer == 'delete') require('./delete').exe(msg);
			else if (answer == 'edit') require('./edit').exe(msg);
			else if (answer == 'list') require('./list').exe(msg);
			else {
				msg.channel.send('This answer was not valid, try again');
				return this.exe(msg);
			} 
		}
	}
};