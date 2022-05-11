module.exports = {
	name: 'UserUpdate',
	async execute(oldUser, newUser, pool) {
		console.log(1);
		if (oldUser.username !== newUser.username) {
			const res = await pool.query(`SELECT * FROM status WHERE userid = '${oldUser.id}'`);
			const username = newUser.username.replace(/'/g, '').replace(/`/g, '`');
			res.rows[0].push(username);
			if (res) {
				if (res.rows[0]) {
					pool.query(`UPDATE status SET pastusernames = ARRAY'${res.rows[0]}'`);
				} else {
					pool.query(`INSET INTO status (userid, pastusernames) VALUES ('${oldUser.id}', ARRAY['${username}'])`);
				}
			} else {
				pool.query(`INSET INTO status (userid, pastusernames) VALUES ('${oldUser.id}', ARRAY['${username}'])`);
			}
		}
	}
};