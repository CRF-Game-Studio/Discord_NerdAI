var fs = require('fs');
var parseXML = require('xml2js').parseString;
var rss;
var obj = {};

function getRSS() {
	var str = fs.readFileSync("steam_rss.xml", "utf-8");
	parseXML(str, (err, res) => {
		// console.log(res['rdf:RDF']['item'][0].title[0]);
		rss = res['rdf:RDF']['item'];
	})
}

exports.findSales = function(msg) {
	getRSS();
	for (var i in rss) {
		if (rss[i].title[0].includes(msg)) {
			console.log("[" + i + "]" + rss[i].title[0]);
			if (rss[i]['steam:appids'][0]['steam:appid'][0] != "0") obj.id = rss[i]['steam:appids'][0]['steam:appid'][0];
			else obj.id = rss[i]['steam:appids'][0]['steam:appid'][1];
			obj.title = rss[i].title[0];
			obj.link = "http://store.steampowered.com/app/" + obj.id;
			return obj;
		}
	}
	return undefined;
}