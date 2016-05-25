var fs = require('fs');

function MessageLog() {
	this.msg = {};
	this.type = {};
	this.subject = {};
	this.loadLog();
}

MessageLog.prototype.addLog = function (id, msg, type, subject) {
	type = type || "Normal";
	subject = subject || "None";
	
	if (subject == "@last")
		subject = this.subject[id][this.subject[id].length - 1];
	
	this.msg[id] = this.msg[id] || [];
	this.type[id] = this.type[id] || [];
	this.subject[id] = this.subject[id] || [];
	
	this.msg[id].push(msg);
	this.type[id].push(type);
	this.subject[id].push(subject);
	this.writeLog();
}

MessageLog.prototype.writeLog = function () {
	fs.writeFile("msg.log", JSON.stringify(this), (err) => {
		if (err) return console.log(err);
		console.log("Log saved");
	})
}

MessageLog.prototype.loadLog = function () {
	var m = fs.readFileSync("msg.log", "utf-8");
	m = JSON.parse(m);
	this.msg = m.msg;
	this.type = m.type;
	this.subject = m.subject;
}

MessageLog.prototype.getLastLogType = function (id) {
	if (this.type[id])
		return this.type[id][this.type[id].length - 1];
	return "NULL";
}

MessageLog.prototype.getLastSubject = function (id) {
	if (this.subject[id])
		return this.subject[id][this.subject[id].length - 1];
	return "None";
}

MessageLog.prototype.print = function () {
	var obj = {};
	obj.msg = this.msg;
	obj.type = this.type;
	obj.subject = this.subject;
	console.log(obj);
}

MessageLog.prototype.msgCount = function (user, userID, msg) {
    var sum = 0;
    for (var i in this.msg[userID])
        if (msgLog[userID][i].includes(msg))
            sum++;
    return user + "已經說了「" + msg + "」" + sum + "次了！";  
}

module.exports = new MessageLog;