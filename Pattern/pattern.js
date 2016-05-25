var fs = require('fs');

function Pattern() {
	this.initialize.apply(this, arguments);
}

Pattern.prototype.constructor = Pattern;

Pattern.prototype.initialize = function () {
	this.pattern = [];
	this.type = [];
	this.result = [];
	this.loadPattern();
}

Pattern.prototype.loadPattern = function() {
	var pattern = fs.readFileSync("pattern.dat", "utf-8");
	pattern = pattern.split("\r\n");
	for (var i in pattern) {
		pattern[i] = pattern[i].split(" ");
		this.type[i] = [];
		this.pattern[i] = [];
		for (var j in pattern[i]) {
			parseInt(j);
			if (j != 0) this.type[i][j - 1] = pattern[i][j][0];
			if (pattern[i][j][0] == '&')
				this.pattern[i][j - 1] = this.loadFile(pattern[i][j].substring(1));
			else if (pattern[i][j][0] == '#')
				this.pattern[i][j - 1] = pattern[i][j].substring(1).split(",");
			else if (pattern[i][j][0] == '|')
				this.pattern[i][j - 1] = pattern[i][j].substring(1).split(",");
			else if (pattern[i][j][0] == '-')
				this.result[i] = pattern[i][j].substring(1);
			else if (pattern[i][j][0] == '@')
				this.pattern[i][j - 1] = pattern[i][j].substring(1);	
		}
	}
}

Pattern.prototype.loadFile = function(file) {
	var file = fs.readFileSync(file, "utf-8");
	return file.split(" ");
}

Pattern.prototype.matchPattern = function (msg) {
	var matchResult, flag, obj = {}, oMsg = msg;
	for (var i in this.pattern) {
		matchResult = []; flag = false; msg = oMsg;
		for (var j in this.pattern[i]) {
			var result = this.matchSlot(msg, i, j);
			if (result.match) {
				matchResult[j] = result.slot;
				msg = msg.substring(result.slot.length);
			} else {
				flag = true;
				break;
			}
		}
		if (!flag) {
			obj.result = this.result[i];
			break;
		}
	}
	obj.match = !flag;
	obj.slot = matchResult; 
	return obj;
}

Pattern.prototype.matchSlot = function (str, iPattern, iSlot) {
	var result = {}; result.match = false;
	var type = this.type[iPattern][iSlot];
	var slot = this.pattern[iPattern][iSlot];
	iSlot = parseInt(iSlot);
	iPattern = parseInt(iPattern);
	if (type == "#" || type == "&") {
		for (var i in slot)
			if (str.indexOf(slot[i]) == 0) {
				result.slot = slot[i];
				result.match = true;
			}
	} else if (type == "|") {
		result.match = true;
		result.slot = "";
		for (var i in slot) {
			if (str.includes(slot[i])) result.match = false;
			if (str.indexOf(slot[i]) == 0) {
				result.slot = slot[i];
				result.match = true;
			}
		}
	} else if (type == "@") {
		if (this.type[iPattern][iSlot + 1] == undefined && str.length != 0) {
			result.match = true;
			result.slot = str;
		} else {
			for (var i = 1; i < str.length; i++) {
				if (this.matchSlot(str.substring(i), iPattern, iSlot + 1).match) {
					result.match = true;
					result.slot = str.substring(0, i);
					break;
				}
			}
		}	
	}
	return result;
}
module.exports = new Pattern;
var p = new Pattern;
console.log(p.matchPattern("IMAS好難"));
