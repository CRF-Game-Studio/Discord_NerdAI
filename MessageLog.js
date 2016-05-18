function MessageLog() {
	this.msg = {};
	this.type = {};
	this.subject = {};
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