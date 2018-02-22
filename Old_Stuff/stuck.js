var fs = require('fs');

exports.stuck = function(msg) {
	var stuck = fs.readFileSync("word_stuck.txt", "utf-8");
	var obj = {value: 0};
	stuck = stuck.split("\r\n");
	for (var i in stuck) {
		if (msg.includes(stuck[i])) {
			obj.value = 100;
			msg = msg.substring(0, msg.indexOf(stuck[i]));
			break;
		}
	}
	var fix = fs.readFileSync("word_fix.txt", "utf-8");
	fix = fix.split("\r\n");
	for (var i in stuck) {
		if (msg.includes(fix[i]))
			msg = msg.substring(0, msg.indexOf(fix[i]));
	}
	obj.msg = msg;
	return obj;
}