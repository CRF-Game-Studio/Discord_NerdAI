var fs = require('fs');
var xmlParse = require('xml2js').parseString;
var http = require('http');

var s = fs.readFileSync("page.html", "utf-8");

var begin = s.indexOf('span class="game_review_summary positive"');
s = s.substring(begin);
s = s.substring(s.indexOf(">"));
s = s.substring(s.indexOf(">") + 1, s.indexOf("<"));

console.log(s);