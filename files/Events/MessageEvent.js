module.exports = {
	name: 'MessageEvent',
	async execute(msg, client, statcord, pool) {
		client.eventfiles.get('Commandhandler').execute(msg, pool, client, statcord); 
		client.eventfiles.get('Levelingmsg').execute(msg, pool, client); 
		client.eventfiles.get('Othereventsmsg').execute(msg, client); 
		client.eventfiles.get('Toxicitycheckmsg').execute(msg, pool, client); 
		client.eventfiles.get('Willismsg').execute(msg); 
		client.eventfiles.get('Disboardmsg').execute(msg, pool); 
		client.eventfiles.get('Afkmsg').execute(msg, pool); 
		client.eventfiles.get('Shipmsg').execute(msg, pool); 
	}
};