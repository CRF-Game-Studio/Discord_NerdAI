var fs = require('fs');
var parseString = require('xml2js').parseString;
var iconv = require('iconv-lite');
var ras;

function parseXML() {
    var str = fs.readFileSync("rss_download.xml"); // Read xml
    str = iconv.decode(str, "big5"); // Change xml encode
    
    function printItem(err, res) {
        var m = res.rss.channel[0].item;
		ras = res;
    } 
    
    parseString(str, printItem);
}

exports.findGNN = function(msg) {
	parseXML(); 
	var m = ras.rss.channel[0].item;
	for (var i in m){
		if (m[i].title[0].includes(msg)){
			var obj = {};
			obj.link = m[i].link;
			obj.title = m[i].title;
			return obj;
		}
	}
	return undefined;
}