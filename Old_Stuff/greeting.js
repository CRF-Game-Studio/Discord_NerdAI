exports.greeting = function(input) {
	var obj = {};
	var fs = require("fs");
	var s = fs.readFileSync("word_greeting.txt", "utf-8");
	var m = s.split("\r\n");
	for (var i = 0; i < m.length; i++) {
		if (input == m[i]) {
			obj.value = 100;
			obj.msg = input;
			i += m.length;
		}
		else obj.value = 0;
	}
	return obj;
}