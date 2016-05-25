var fs = require('fs');
var rnd = require('./Rand.js');
function Pattern() {
	this.initialize.apply(this, arguments);
}

Pattern.prototype.constructor = Pattern;

Pattern.prototype.initialize = function () {
	this.pattern = []; // pattern
	this.type = []; // pattern slot type
	this.result = []; // patter type
	this.response = {};
	this.loadPattern();
	this.loadResponse();
}

Pattern.prototype.loadPattern = function() {
	var pattern = fs.readFileSync("pattern.dat", "utf-8");
	var onlyComma = ["", ""];
	pattern = pattern.trim();
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

Pattern.prototype.loadResponse = function() {
	var pattern = fs.readFileSync("response.dat", "utf-8");
	var onlyComma = ["", ""];
	pattern = pattern.trim();
	pattern = pattern.split("\r\n");
	for (var i in pattern) {
		var patternType;
		var patternArr = [], typeArr = [];
		pattern[i] = pattern[i].split(" ");
		for (var j in pattern[i]) {
			parseInt(j);
			if (j != 0) typeArr[j - 1] = pattern[i][j][0];
			if (pattern[i][j][0] == '&')
				patternArr[j - 1] = this.loadFile(pattern[i][j].substring(1));
			else if (pattern[i][j][0] == '#')
				patternArr[j - 1] = pattern[i][j].substring(1).split(",");
			else if (pattern[i][j][0] == '|')
				patternArr[j - 1] = pattern[i][j].substring(1).split(",");
			else if (pattern[i][j][0] == '-')
				patternType = pattern[i][j].substring(1);
			else if (pattern[i][j][0] == '@')
				patternArr[j - 1] = pattern[i][j].substring(1);
		}
		this.response[patternType] = this.response[patternType] || {};
		this.response[patternType].pattern = this.response[patternType].pattern || []; 
		this.response[patternType].pattern.push(patternArr);
		this.response[patternType].type = this.response[patternType].type || []; 
		this.response[patternType].type.push(typeArr);
	}
	// console.log(this.response["GameDifficult"]);
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
				msg = msg.substring(result.slot.length).trim();
				// console.log(msg);
			} else {
				flag = true;
				break;
			}
		}
		if (!flag) {
			obj.result = this.result[i];
			obj.type = this.type[i];
			obj.pattern = this.pattern[i];
			break;
		}
	}
	obj.match = !flag;
	obj.slot = matchResult;
	obj.getTarget = function (n) {
		if (n == undefined) {
			for (var i in obj.type) {
				if (obj.type[i] == "@") return obj.slot[i];
			}
		} else {
			for (var i in obj.slot) {
				if (obj.type[i] == "@" && obj.pattern[i] == n) return obj.slot[i];
			}	
		}
	}
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

Pattern.prototype.getResponse = function (type, result) {
	if (!type) return;
	if (!this.response[type]) return;
	
	var m = "", rRes = rnd(this.response[type].pattern.length);
	console.log(this.response[type].pattern[rRes], rRes);
	for (var i in this.response[type].pattern[rRes]) {
		// console.log(this.response[type].type[rRes][i]);
		if (this.response[type].type[rRes][i] == "@") m += result.getTarget(this.response[type].pattern[rRes][i]);
		else m += this.response[type].pattern[rRes][i][rnd(this.response[type].pattern[rRes][i].length)];
		//m += this.response[type].pattern[rRes][i][0];
	}
	return m;
}
module.exports = new Pattern;
var p = new Pattern;
// console.log(p.matchPattern("Daily Deal - Lord of the Rings: War in the North, 75% Off").getTarget("discount"));
// console.log(p.pattern);
var rrr = p.matchPattern("我覺得PP好難");
var ss = p.getResponse(rrr.result, rrr);
console.log("[", ss, "]");
