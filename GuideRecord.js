function GuideRecord() {
	this.guide = {};
	this.provide = {};
}

GuideRecord.prototype.addGuide = function (game, name, msg) {
	this.provide[game] = this.provide[game] || [];
	this.provide[game].push(name);
	this.guide[game] = this.guide[game] || {};
	this.guide[game][name] = this.guide[game][name] || [];
	this.guide[game][name].push(msg);
	// console.log(this.guide);
}

module.exports = new GuideRecord;