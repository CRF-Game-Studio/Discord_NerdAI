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
	var matchResult, flag, obj = {}, msgBaked = msg;
	for (var i in this.pattern) { // 檢查每個句型
		msg = msgBaked;	// 初始化訊息
		matchResult = []; flag = false; // 初始化回傳結果
		for (var j in this.pattern[i]) { // 檢查每個Slot
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
			obj.type = this.type[i];
			break;
		}
	}
	obj.getTarget = function (n) {
		n = n || 1;
		for (var i in obj.type) {
			if (obj.type[i] == "@") n--;
			if (!n) return obj.slot[i];
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
// var p = new Pattern;
// console.log(p.matchPattern("我把杏之歌full掉了"));
