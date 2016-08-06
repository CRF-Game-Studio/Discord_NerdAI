var fs = require('fs');
var parseString = require('xml2js').parseString;
var iconv = require('iconv-lite');
var http = require('http');
var ras;
var yoooo = false;

function GNN() {
	this.news = [];
	this.init = false;
	var file = fs.createWriteStream("rss_download.xml");
    var request = http.get("http://gnn.gamer.com.tw/rss.xml", function (response) {
        response.pipe(file, { end: false });
	});
	setTimeout(() => {
		while (!yoooo) parseXML();
		var m = ras.rss.channel[0].item;
		var obj = [];
		for (var i in m) {
			var tt = m[i].title[0];
			obj[i] = {};
			obj[i].title = m[i].title[0];
			obj[i].link = m[i].link;
			obj[i].subject = [];
			obj[i].subjectType = [];
			obj[i].subjectEng = obj[i].subjectNotEng = 0;
			var s1, Symbol = "~!@#$%^&*()_+|？！～：:";
			s1 = m[i].title[0].substring(tt.indexOf("《") + 1, tt.indexOf("》")).toLowerCase()
			for (var j in Symbol)
				while (s1.includes(Symbol[j])) s1 = s1.replace(Symbol[j], " ");
			s1 = s1.split(" ");
			for (var j in s1)
				if (s1[0].search(/[^A-Za-z0-9\s]/) != -1) {
					obj[i].subjectType[j] = 0;
					obj[i].subjectNotEng++;
				} else {
					obj[i].subjectType[j] = 1;
					obj[i].subjectEng++;
				}
			obj[i].subject = s1;
		}
		this.news = obj;
		//console.log(this.news);
		this.init = true;
	}, 1000);
}

function parseXML() {
    var str = fs.readFileSync("rss_download.xml"); // Read xml
    str = iconv.decode(str, "big5"); // Change xml encode
    function printItem(err, res) {
		if (err || !res) return;
		else yoooo = true;
        var m = res.rss.channel[0].item;
		ras = res;
    } 
    parseString(str, printItem);
}

GNN.prototype.findGNN = function (msg) {
	var tag;
	msg = msg.toLowerCase();
	if (msg.search(/[^A-Za-z0-9\s]/) != -1) tag = "neng";
	else tag = "eng";
	msg = msg.split(" ");
	console.log(msg);
	var result = {};
	for (var i in this.news) {
		if (this.news[i].title.toLowerCase().includes(msg[0])) {
			var flag = [];
			for (var k in msg) {
				for (var j in this.news[i].subject) {
					if (this.news[i].subject[j] == msg[k]) {
						flag.push(true);
						break;
					}
				}
			}
			console.log(flag);
			var fflag = false;
			for (var k in msg) {
				console.log(flag[k]);
				if (!flag[k]) {
					fflag = true;
					break;
				}
			}
			if (!fflag) {
				result = this.news[i];
				console.log(tag, msg.length / this.news[i].subjectEng > 0.6);
				if (tag == "eng") {
					if (msg.length / this.news[i].subjectEng > 0.6) result.value = 100;
					else result.value = 80;
				} else if (tag == "neng") {
					if (msg.length / this.news[i].subjectNotEng > 0.6) result.value = 100;
					else result.value = 80;
				}
				return result;
			}
		}
	}
	for (var i in this.news) {
		if (this.news[i].title.toLowerCase().includes(msg)) {
			result = this.news[i];
			result.value = 60;
			return result;
		}
	}
}
module.exports = new GNN;
// var gg = new GNN;
// setTimeout(() => {
// 	console.log(gg.findGNN("FRONT"));
// }, 1000);