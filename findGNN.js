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
			var s1, Symbol = "~!@#$%^&*()_+|？！～：:";
			s1 = m[i].title[0].substring(tt.indexOf("《") + 1, tt.indexOf("》")).toLowerCase()
			for (var j in Symbol)
				while (s1.includes(Symbol[j])) s1 = s1.replace(Symbol[j], " ");
			s1 = s1.split(" ");
			obj[i].subject = s1;
		}
		this.news = obj;
		console.log(this.news);
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
	msg = msg.toLowerCase();
	var result = {};
	for (var i in this.news) {
		if (this.news[i].title.includes(msg)) {
			for (var j in this.news[i].subject)
				if (this.news[i].subject[j] == msg) {
					result = this.news[i];
					result.value = 100;
					return result;
				}
		}
	}
	for (var i in this.news) {
		if (this.news[i].title.includes(msg)) {
			result = this.news[i];
			result.value = 80;
			return result;
		}
	}
}
module.exports = new GNN;
// var gg = new GNN;
// setTimeout(() => {
// 	console.log(gg.findGNN("SD"));
// }, 1000);