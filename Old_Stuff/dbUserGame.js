var mysql = require('mysql');

var db = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: 'Debug0420',
	database: 'nerd_ai'
});

db.connect();

function dbUG() {
	this.list = false;
}

dbUG.prototype.newRelation = function(userID, game, chID, say) {
	db.query(queryUser(userID), (err, rows) => {
		console.log(rows);
		var flag = true;
		for (var i in rows) {
			if (rows[i].game.toLowerCase() == game.toLowerCase()) {
				flag = false;
				break;
			}
		}
		if (!flag) {
			say(chID, "你講過啦");
		} else {
			say(chID, "原來你喜歡" + game);
			db.query(insert(userID, game));
		}
	});
}

dbUG.prototype.queryGame = function(userID, chID, say) {
	db.query(queryUser(userID), (err, rows) => {
		var m = [];
		for (var i in rows) 
			m.push(rows[i].game);
		if (m[0]) say(chID, "你玩過" + m.join(", "));
		else say(chID, "還沒聽你說過你玩過哪些遊戲欸");
	})
	
}

function queryUser(userID) {
	return 'select game from user_game where userID = "' + userID + '";';
}

function insert(userID, game) {
	return 'insert into user_game value("' + userID + '", "' + game + '");';
}

module.exports = new dbUG;