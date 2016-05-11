var fs = require('fs');

function loadFile(file) {
	var file = fs.readFileSync(file, "utf-8");
	return file.split(" ");
}

function loadPattern() {
	var type = [], obj = {};
	var pattern = fs.readFileSync("pattern.dat", "utf-8");
	pattern = pattern.split("\r\n");
	for (var i in pattern) {
		pattern[i] = pattern[i].split(" ");
		type[i] = [];
		for (var j in pattern[i]) {
			type[i][j] = pattern[i][j][0];
			if (pattern[i][j][0] == '&')
				pattern[i][j] = loadFile(pattern[i][j].substring(1));
			else if (pattern[i][j][0] == '#')
				pattern[i][j] = pattern[i][j].substring(1).split(",");
			else if (pattern[i][j][0] == '|')
				pattern[i][j] = pattern[i][j].substring(1).split(",");	
		}
	}
	obj.pattern = pattern;
	obj.type = type;
	console.log(obj.pattern);
	return obj;
}

function matchPattern(msg) {
	
}

loadPattern();