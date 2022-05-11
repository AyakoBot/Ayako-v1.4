module.exports = {
	name: 'PresenceUpdate',
	async execute(oldMember, newMember, pool) {
		if (!oldMember || !newMember) return;
		const user = newMember.user;
		const res = await pool.query(`SELECT * FROM status WHERE userid = '${user.id}'`);
		if (res) {
			if (res.rows[0]) {
				if (newMember.status == 'online') {
					if (oldMember.status == 'online') return;
					pool.query(`
					UPDATE status SET offline = false WHERE userid = '${user.id}';
					UPDATE status SET offlinesince = null WHERE userid = '${user.id}';
					UPDATE status SET dnd = false WHERE userid = '${user.id}';
					UPDATE status SET dndsince = null WHERE userid = '${user.id}';
					UPDATE status SET online = true WHERE userid = '${user.id}';
					UPDATE status SET onlinesince = '${Date.now()}' WHERE userid = '${user.id}';
					UPDATE status SET idle = false WHERE userid = '${user.id}';
					UPDATE status SET idlesince = null WHERE userid = '${user.id}';
					`);
				}
				if (newMember.status == 'dnd') {
					if (oldMember.status == 'dnd') return;
					pool.query(`
					UPDATE status SET offline = false WHERE userid = '${user.id}';
					UPDATE status SET offlinesince = null WHERE userid = '${user.id}';
					UPDATE status SET dnd = true WHERE userid = '${user.id}';
					UPDATE status SET dndsince = '${Date.now()}' WHERE userid = '${user.id}';
					UPDATE status SET online = false WHERE userid = '${user.id}';
					UPDATE status SET onlinesince = null WHERE userid = '${user.id}';
					UPDATE status SET idle = false WHERE userid = '${user.id}';
					UPDATE status SET idlesince = null WHERE userid = '${user.id}';
					`);			
				}
				if (newMember.status == 'idle') {
					if (oldMember.status == 'idle') return;
					pool.query(`
					UPDATE status SET offline = false WHERE userid = '${user.id}';
					UPDATE status SET offlinesince = null WHERE userid = '${user.id}';
					UPDATE status SET dnd = false WHERE userid = '${user.id}';
					UPDATE status SET dndsince = null WHERE userid = '${user.id}';
					UPDATE status SET online = false WHERE userid = '${user.id}';
					UPDATE status SET onlinesince = null WHERE userid = '${user.id}';
					UPDATE status SET idle = true WHERE userid = '${user.id}';
					UPDATE status SET idlesince = '${Date.now()}' WHERE userid = '${user.id}';
					`);			
				}
				if (newMember.status == 'offline') {
					if (oldMember.status == 'offline') return;
					pool.query(`
					UPDATE status SET offline = true WHERE userid = '${user.id}';
					UPDATE status SET offlinesince = '${Date.now()}' WHERE userid = '${user.id}';
					UPDATE status SET dnd = false WHERE userid = '${user.id}';
					UPDATE status SET dndsince = null WHERE userid = '${user.id}';
					UPDATE status SET online = false WHERE userid = '${user.id}';
					UPDATE status SET onlinesince = null WHERE userid = '${user.id}';
					UPDATE status SET idle = false WHERE userid = '${user.id}';
					UPDATE status SET idlesince = null WHERE userid = '${user.id}';
					`);			
				} else {
					if (newMember.status == 'online') {
						pool.query(`INSERT INTO status (userid, offline, offlinesince, dnd, dndsince, online, onlinesince, idle, idlesince) VALUES ('${user.id}', 'false', null, 'false', null, 'true', '${Date.now()}', 'false', null)`).catch(() => {
							if (oldMember.status == 'online') return;
							pool.query(`
							UPDATE status SET offline = false WHERE userid = '${user.id}';
							UPDATE status SET offlinesince = null WHERE userid = '${user.id}';
							UPDATE status SET dnd = false WHERE userid = '${user.id}';
							UPDATE status SET dndsince = null WHERE userid = '${user.id}';
							UPDATE status SET online = true WHERE userid = '${user.id}';
							UPDATE status SET onlinesince = '${Date.now()}' WHERE userid = '${user.id}';
							UPDATE status SET idle = false WHERE userid = '${user.id}';
							UPDATE status SET idlesince = null WHERE userid = '${user.id}';
							`);
						});
					}
					if (newMember.status == 'dnd') {
						pool.query(`INSERT INTO status (userid, offline, offlinesince, dnd, dndsince, online, onlinesince, idle, idlesince) VALUES ('${user.id}', 'false', null, 'true', '${Date.now()}', 'false', null, 'false', null)`).catch(() => {
							if (oldMember.status == 'dnd') return;
							pool.query(`
							UPDATE status SET offline = false WHERE userid = '${user.id}';
							UPDATE status SET offlinesince = null WHERE userid = '${user.id}';
							UPDATE status SET dnd = true WHERE userid = '${user.id}';
							UPDATE status SET dndsince = '${Date.now()}' WHERE userid = '${user.id}';
							UPDATE status SET online = false WHERE userid = '${user.id}';
							UPDATE status SET onlinesince = null WHERE userid = '${user.id}';
							UPDATE status SET idle = false WHERE userid = '${user.id}';
							UPDATE status SET idlesince = null WHERE userid = '${user.id}';
							`);		
						});
					}
					if (newMember.status == 'idle') {
						pool.query(`INSERT INTO status (userid, offline, offlinesince, dnd, dndsince, online, onlinesince, idle, idlesince) VALUES ('${user.id}', 'false', null, 'false', null, 'false', null, 'true', '${Date.now()}')`).catch(() => {
							if (oldMember.status == 'idle') return;
							pool.query(`
							UPDATE status SET offline = false WHERE userid = '${user.id}';
							UPDATE status SET offlinesince = null WHERE userid = '${user.id}';
							UPDATE status SET dnd = false WHERE userid = '${user.id}';
							UPDATE status SET dndsince = null WHERE userid = '${user.id}';
							UPDATE status SET online = false WHERE userid = '${user.id}';
							UPDATE status SET onlinesince = null WHERE userid = '${user.id}';
							UPDATE status SET idle = true WHERE userid = '${user.id}';
							UPDATE status SET idlesince = '${Date.now()}' WHERE userid = '${user.id}';
							`);		
						});
					}
					if (newMember.status == 'offline') {
						pool.query(`INSERT INTO status (userid, offline, offlinesince, dnd, dndsince, online, onlinesince, idle, idlesince) VALUES ('${user.id}', 'true', '${Date.now()}', 'false', null, 'false', null, 'false', null)`).catch(() => {
							if (oldMember.status == 'offline') return;
							pool.query(`
							UPDATE status SET offline = true WHERE userid = '${user.id}';
							UPDATE status SET offlinesince = '${Date.now()}' WHERE userid = '${user.id}';
							UPDATE status SET dnd = false WHERE userid = '${user.id}';
							UPDATE status SET dndsince = null WHERE userid = '${user.id}';
							UPDATE status SET online = false WHERE userid = '${user.id}';
							UPDATE status SET onlinesince = null WHERE userid = '${user.id}';
							UPDATE status SET idle = false WHERE userid = '${user.id}';
							UPDATE status SET idlesince = null WHERE userid = '${user.id}';
							`);		
						});
					}
				}
			} else {
				if (newMember.status == 'online') {
					pool.query(`INSERT INTO status (userid, offline, offlinesince, dnd, dndsince, online, onlinesince, idle, idlesince) VALUES ('${user.id}', 'false', null, 'false', null, 'true', '${Date.now()}', 'false', null)`).catch(() => {
						if (oldMember.status == 'online') return;
						pool.query(`
						UPDATE status SET offline = false WHERE userid = '${user.id}';
						UPDATE status SET offlinesince = null WHERE userid = '${user.id}';
						UPDATE status SET dnd = false WHERE userid = '${user.id}';
						UPDATE status SET dndsince = null WHERE userid = '${user.id}';
						UPDATE status SET online = true WHERE userid = '${user.id}';
						UPDATE status SET onlinesince = '${Date.now()}' WHERE userid = '${user.id}';
						UPDATE status SET idle = false WHERE userid = '${user.id}';
						UPDATE status SET idlesince = null WHERE userid = '${user.id}';
						`);
					});
				}
				if (newMember.status == 'dnd') {
					pool.query(`INSERT INTO status (userid, offline, offlinesince, dnd, dndsince, online, onlinesince, idle, idlesince) VALUES ('${user.id}', 'false', null, 'true', '${Date.now()}', 'false', null, 'false', null)`).catch(() => {
						if (oldMember.status == 'dnd') return;
						pool.query(`
						UPDATE status SET offline = false WHERE userid = '${user.id}';
						UPDATE status SET offlinesince = null WHERE userid = '${user.id}';
						UPDATE status SET dnd = true WHERE userid = '${user.id}';
						UPDATE status SET dndsince = '${Date.now()}' WHERE userid = '${user.id}';
						UPDATE status SET online = false WHERE userid = '${user.id}';
						UPDATE status SET onlinesince = null WHERE userid = '${user.id}';
						UPDATE status SET idle = false WHERE userid = '${user.id}';
						UPDATE status SET idlesince = null WHERE userid = '${user.id}';
						`);		
					});
				}
				if (newMember.status == 'idle') {
					pool.query(`INSERT INTO status (userid, offline, offlinesince, dnd, dndsince, online, onlinesince, idle, idlesince) VALUES ('${user.id}', 'false', null, 'false', null, 'false', null, 'true', '${Date.now()}')`).catch(() => {
						if (oldMember.status == 'idle') return;
						pool.query(`
						UPDATE status SET offline = false WHERE userid = '${user.id}';
						UPDATE status SET offlinesince = null WHERE userid = '${user.id}';
						UPDATE status SET dnd = false WHERE userid = '${user.id}';
						UPDATE status SET dndsince = null WHERE userid = '${user.id}';
						UPDATE status SET online = false WHERE userid = '${user.id}';
						UPDATE status SET onlinesince = null WHERE userid = '${user.id}';
						UPDATE status SET idle = true WHERE userid = '${user.id}';
						UPDATE status SET idlesince = '${Date.now()}' WHERE userid = '${user.id}';
						`);		
					});
				}
				if (newMember.status == 'offline') {
					pool.query(`INSERT INTO status (userid, offline, offlinesince, dnd, dndsince, online, onlinesince, idle, idlesince) VALUES ('${user.id}', 'true', '${Date.now()}', 'false', null, 'false', null, 'false', null)`).catch(() => {
						if (oldMember.status == 'offline') return;
						pool.query(`
						UPDATE status SET offline = true WHERE userid = '${user.id}';
						UPDATE status SET offlinesince = '${Date.now()}' WHERE userid = '${user.id}';
						UPDATE status SET dnd = false WHERE userid = '${user.id}';
						UPDATE status SET dndsince = null WHERE userid = '${user.id}';
						UPDATE status SET online = false WHERE userid = '${user.id}';
						UPDATE status SET onlinesince = null WHERE userid = '${user.id}';
						UPDATE status SET idle = false WHERE userid = '${user.id}';
						UPDATE status SET idlesince = null WHERE userid = '${user.id}';
						`);		
					});
				}
			}
		}
	}
};